!macro customInstall
  DetailPrint "Registering CharmDrop Custom URI Scheme (charmdrop://)..."
  WriteRegStr HKCU "Software\Classes\charmdrop" "" "URL:CharmDrop Protocol"
  WriteRegStr HKCU "Software\Classes\charmdrop" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\charmdrop\DefaultIcon" "" "$INSTDIR\CharmDrop.exe,0"
  WriteRegStr HKCU "Software\Classes\charmdrop\shell" "" "open"
  WriteRegStr HKCU "Software\Classes\charmdrop\shell\open" "" ""
  WriteRegStr HKCU "Software\Classes\charmdrop\shell\open\command" "" '"$INSTDIR\CharmDrop.exe" "%1"'
!macroend

!macro customUnInstall
  DeleteRegKey HKCU "Software\Classes\charmdrop"
!macroend
