<script>
  import { page } from "$app/stores";

  const isActive = (href, pathname) =>
    href === pathname || (href !== "/" && pathname.startsWith(href));
</script>

<header>
  <a href="/projects" class:active={isActive("/projects", $page.url.pathname)}
    >projects</a
  >
  <a href="/" class:active={isActive("/", $page.url.pathname)}>krisenstab</a>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    background-color: white;
    box-shadow: 0 3px 6px 0 #e7e7e7;
    width: 100%;
    text-align: right;
  }

  a {
    text-decoration: none;
    color: var(--link-color, #111);
  }

  header a.active {
    color: var(--color-1, var(--faded-color, #5a5a5a));
    font-weight: 600;
  }
</style>
