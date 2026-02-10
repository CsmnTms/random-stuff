### Windows Window Drag Resizer

**Created:** January 2026

**Last updated:** January 2026

***! Requires AutoHotKey v2.0 https://www.autohotkey.com/ !***

Small script to enable moving and resizing a window pane from anywhere inside of it by holding down the WIN key and dragging the mouse buttons.

##### **Inside any window:**
- WIN (hold) + LClick (drag) -> move window
- WIN (hold) + RClick (drag) -> resize window

##### **Place in shell:startup for automatic startup.**
- WIN + R -> "shell:startup"
- OR "%appdata%\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"

##### **Auto-start as admin (recommended)**
Window panes that run as admin (i.e. an elevated Visual Studio) will need the script as admin. Startup items cannot auto-elevate, so we must use a shortcut.

1. Right-click the .ahk file → Create shortcut
2. Right-click the shortcut → Properties
3. Click Advanced…
4. Check Run as administrator
5. OK → OK
6. Move the shortcut into: ***%appdata%\Roaming\Microsoft\Windows\Start Menu\Programs\Startup***