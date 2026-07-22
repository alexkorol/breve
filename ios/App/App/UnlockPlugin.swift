import Foundation
import Capacitor
import StoreKit

/// One-time "unlock everything" purchase via StoreKit 2.
/// Registered from AppViewController; called from src/iap.ts.
@objc(UnlockPlugin)
public class UnlockPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "UnlockPlugin"
    public let jsName = "Unlock"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getProduct", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isOwned", returnType: CAPPluginReturnPromise)
    ]

    static let productId = "com.alexkorol.jimothy.unlock"

    private func loadProduct() async throws -> Product? {
        try await Product.products(for: [Self.productId]).first
    }

    private func ownsUnlock() async -> Bool {
        for await entitlement in Transaction.currentEntitlements {
            if case .verified(let transaction) = entitlement,
               transaction.productID == Self.productId,
               transaction.revocationDate == nil {
                return true
            }
        }
        return false
    }

    @objc func getProduct(_ call: CAPPluginCall) {
        Task {
            do {
                guard let product = try await loadProduct() else {
                    call.reject("Product not found")
                    return
                }
                call.resolve([
                    "productId": product.id,
                    "displayPrice": product.displayPrice,
                    "title": product.displayName
                ])
            } catch {
                call.reject("Store unavailable: \(error.localizedDescription)")
            }
        }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        Task {
            do {
                guard let product = try await loadProduct() else {
                    call.reject("Product not found")
                    return
                }
                let result = try await product.purchase()
                switch result {
                case .success(let verification):
                    switch verification {
                    case .verified(let transaction):
                        await transaction.finish()
                        call.resolve(["state": "purchased"])
                    case .unverified:
                        call.reject("Purchase could not be verified")
                    }
                case .pending:
                    call.resolve(["state": "pending"])
                case .userCancelled:
                    call.resolve(["state": "cancelled"])
                @unknown default:
                    call.reject("Unknown purchase result")
                }
            } catch {
                call.reject("Purchase failed: \(error.localizedDescription)")
            }
        }
    }

    @objc func isOwned(_ call: CAPPluginCall) {
        Task {
            call.resolve(["owned": await ownsUnlock()])
        }
    }

    @objc func restore(_ call: CAPPluginCall) {
        Task {
            // AppStore.sync() forces a refresh; it throws if the user cancels
            // the sign-in sheet, in which case the entitlement check still runs.
            try? await AppStore.sync()
            call.resolve(["owned": await ownsUnlock()])
        }
    }
}
