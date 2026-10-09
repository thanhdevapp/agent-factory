// AGMon AI Factory - Desktop Companion Native Entry (Tauri 2.0)
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            // Setup tray icon and global shortcuts
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running agmon desktop application");
}
