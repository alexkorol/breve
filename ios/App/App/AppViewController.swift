import UIKit
import Capacitor

/// Custom bridge controller whose only job is registering in-app plugins.
/// Main.storyboard points here instead of at CAPBridgeViewController.
class AppViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(UnlockPlugin())
    }
}
