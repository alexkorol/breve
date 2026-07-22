import WidgetKit
import SwiftUI

// Home-screen streak widget. This file belongs to the JimothyWidget
// extension target, which must be created once in Xcode (File > New >
// Target > Widget Extension, name "JimothyWidget", then replace its
// generated source with this file). Both the app and the extension need
// the App Group "group.com.alexkorol.jimothy". See docs/ios.md.

struct StreakEntry: TimelineEntry {
    let date: Date
    let streak: Int
    let reviewsToday: Int
    let tierName: String
}

struct StreakProvider: TimelineProvider {
    static let appGroup = "group.com.alexkorol.jimothy"

    func loadEntry() -> StreakEntry {
        let defaults = UserDefaults(suiteName: Self.appGroup)
        return StreakEntry(
            date: Date(),
            streak: defaults?.integer(forKey: "streak") ?? 0,
            reviewsToday: defaults?.integer(forKey: "reviewsToday") ?? 0,
            tierName: defaults?.string(forKey: "tierName") ?? ""
        )
    }

    func placeholder(in context: Context) -> StreakEntry {
        StreakEntry(date: Date(), streak: 7, reviewsToday: 12, tierName: "Orange flame")
    }

    func getSnapshot(in context: Context, completion: @escaping (StreakEntry) -> Void) {
        completion(loadEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<StreakEntry>) -> Void) {
        // Refresh at the next midnight so a missed day shows honestly even if
        // the app is not opened; the app also pushes reloads on every review.
        let midnight = Calendar.current.startOfDay(for: Date()).addingTimeInterval(86400)
        completion(Timeline(entries: [loadEntry()], policy: .after(midnight)))
    }
}

struct JimothyWidgetView: View {
    var entry: StreakEntry

    var body: some View {
        VStack(spacing: 4) {
            Text("🔥")
                .font(.system(size: 34))
            Text("\(entry.streak)")
                .font(.system(size: 30, weight: .bold, design: .rounded))
                .foregroundColor(Color(red: 0.94, green: 0.91, blue: 0.86))
            Text(entry.streak == 1 ? "day streak" : "day streak")
                .font(.system(size: 12))
                .foregroundColor(Color(red: 0.64, green: 0.60, blue: 0.54))
            if entry.reviewsToday > 0 {
                Text("\(entry.reviewsToday) today")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(Color(red: 0.93, green: 0.71, blue: 0.31))
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .containerBackground(for: .widget) {
            Color(red: 0.086, green: 0.075, blue: 0.063)
        }
    }
}

@main
struct JimothyWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "JimothyStreak", provider: StreakProvider()) { entry in
            JimothyWidgetView(entry: entry)
        }
        .configurationDisplayName("Streak flame")
        .description("Your current streak, on the home screen.")
        .supportedFamilies([.systemSmall])
    }
}
