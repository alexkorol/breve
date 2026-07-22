import Foundation
import Capacitor
#if canImport(WidgetKit)
import WidgetKit
#endif

/// Bridges streak stats into the shared app-group defaults the home-screen
/// widget reads, and asks WidgetKit to refresh. Harmless no-op until the
/// app group exists (requires a signing team; see docs/ios.md).
@objc(StreakWidgetPlugin)
public class StreakWidgetPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "StreakWidgetPlugin"
    public let jsName = "StreakWidget"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "update", returnType: CAPPluginReturnPromise)
    ]

    static let appGroup = "group.com.alexkorol.jimothy"

    @objc func update(_ call: CAPPluginCall) {
        let streak = call.getInt("streak") ?? 0
        let reviewsToday = call.getInt("reviewsToday") ?? 0
        let tierName = call.getString("tierName") ?? ""
        if let defaults = UserDefaults(suiteName: Self.appGroup) {
            defaults.set(streak, forKey: "streak")
            defaults.set(reviewsToday, forKey: "reviewsToday")
            defaults.set(tierName, forKey: "tierName")
            defaults.set(Date().timeIntervalSince1970, forKey: "updatedAt")
        }
        #if canImport(WidgetKit)
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        #endif
        call.resolve()
    }
}
