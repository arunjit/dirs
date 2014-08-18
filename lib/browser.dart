import 'package:polymer/polymer.dart';
import 'package:core_elements/core_drawer_panel.dart';

@CustomTag('dir-browser')
class Browser extends PolymerElement {
  Browser.created() : super.created();

  @published String path;
  CoreDrawerPanel _drawerPanel = null;

  String get currentDir => path.substring(path.lastIndexOf("/") + 1);

  toggleSidebar() {
    drawerPanel.selected = drawerPanel.selected == 'drawer' ? 'main' : 'drawer';
  }

  CoreDrawerPanel get drawerPanel {
    if (_drawerPanel == null)
      _drawerPanel = $['drawerPanel']  as CoreDrawerPanel;
    return _drawerPanel;
  }
}