-- Add Blog Management menu item to admin navigation
INSERT INTO NavItem (id, label, path, type, "order")
VALUES (
  lower(hex(randomblob(16))),
  'Blog Yönetimi',
  '/admin/blog',
  'admin',
  7
);
