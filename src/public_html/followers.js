Traceback (most recent call last):
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/web/api.py", line 339, in send_error
    'text/html')
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/web/chrome.py", line 684, in render_template
    data = self.populate_data(req, data)
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/web/chrome.py", line 592, in populate_data
    d['chrome'].update(req.chrome)
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/web/api.py", line 168, in __getattr__
    value = self.callbacks[name](self)
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/web/chrome.py", line 460, in prepare_request
    for category, name, text in contributor.get_navigation_items(req):
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/ticket/web_ui.py", line 133, in get_navigation_items
    if 'TICKET_CREATE' in req.perm:
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/perm.py", line 523, in has_permission
    return self._has_permission(action, resource)
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/perm.py", line 536, in _has_permission
    decision = PermissionSystem(self.env). \
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/perm.py", line 424, in check_permission
    perm)
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/perm.py", line 281, in check_permission
    permissions = PermissionSystem(self.env). \
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/perm.py", line 357, in get_user_permissions
    for perm in self.store.get_user_permissions(username):
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/perm.py", line 175, in get_user_permissions
    cursor.execute("SELECT username,action FROM permission")
  File "/usr/lib/python2.4/site-packages/Trac-0.11-py2.4.egg/trac/db/util.py", line 51, in execute
    return self.cursor.execute(sql)
  File "/usr/lib64/python2.4/site-packages/sqlite/main.py", line 244, in execute
    self.rs = self.con.db.execute(SQL)
OperationalError: database is locked
