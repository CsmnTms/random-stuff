#Requires AutoHotkey v2.0
#SingleInstance Force

CoordMode "Mouse", "Screen"

; ---- CONFIG ----
MOVE_KEY   := "Alt"
MIN_W      := 200
MIN_H      := 120
FRAME_MS   := 1   ; lower = smoother, higher = less CPU
; ----------------

#LButton::{
    MouseGetPos &px, &py, &hwnd, , 2
    if !hwnd
        return

    win := "ahk_id " hwnd
    if !WinExist(win)
        return

    WinGetPos &wx, &wy,,, win

    lastX := px
    lastY := py

    while GetKeyState("LButton", "P") {
        MouseGetPos &cx, &cy
        dx := cx - lastX
        dy := cy - lastY

        wx += dx
        wy += dy

        WinMove wx, wy, , , win

        lastX := cx
        lastY := cy
        Sleep FRAME_MS
    }
}

#RButton::{
    MouseGetPos &px, &py, &hwnd, , 2
    if !hwnd
        return

    win := "ahk_id " hwnd
    if !WinExist(win)
        return

    WinGetPos ,, &w, &h, win

    lastX := px
    lastY := py

    while GetKeyState("RButton", "P") {
        MouseGetPos &cx, &cy
        dx := cx - lastX
        dy := cy - lastY

        w += dx
        h += dy

        if (w < MIN_W)
            w := MIN_W
        if (h < MIN_H)
            h := MIN_H

        WinMove , , w, h, win

        lastX := cx
        lastY := cy
        Sleep FRAME_MS
    }
}
