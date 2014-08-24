library dirs.browser;

import 'package:core_elements/core_ajax_dart.dart';
import 'package:core_elements/core_drawer_panel.dart';
import 'package:core_elements/core_list_dart.dart';
import 'package:dirs/util.dart';
import 'package:polymer/polymer.dart';

@CustomTag('dir-browser')
class Browser extends PolymerElement {

  Browser.created() : super.created() {
    _xhr = $['xhr'] as CoreAjax;
    _drawerPanel = $['drawerPanel']  as CoreDrawerPanel;
    _list = $['list'] as CoreList;
  }

  @published String baseUrl;
  @published String path;

  @observable ObservableList items = new ObservableList();

  CoreAjax _xhr = null;
  CoreDrawerPanel _drawerPanel = null;
  CoreList _list = null;

  String get currentDir => firstNonEmpty(path.substring(path.lastIndexOf('/') + 1), '/');
  String get currentUrl => baseUrl + path;

  toggleSidebar() {
    _drawerPanel.selected = _drawerPanel.selected == 'drawer' ? 'main' : 'drawer';
  }

  pathChanged(oldPath, newPath) {
    _xhr.url = currentUrl;  // No dynamic binding :(.
  }

  update(_, json) {
    json = json as Map;
    items.clear();
    (json['response'] as List).forEach((item) => items.add(new FileInfo.fromJson(item)));
  }
}

class FileInfo {
  bool isDir;
  String name;
  String path;

  // View args
  bool selected = false;

  FileInfo({this.isDir, this.name, this.path});

  FileInfo.fromJson(Map json) {
    isDir = json['is_dir'];
    name = json['name'];
    path = json['path'];
  }
}
