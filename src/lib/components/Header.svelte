<script>
  import { page } from "$app/stores";
  const isActive = (href, pathname) =>
    href === pathname || (href !== "/" && pathname.startsWith(href));
</script>

<header
  class="sticky top-0 w-full bg-white shadow-sm text-right text-[1.2em] sm:text-[1.1em] sm:leading-[1.2em] leading-[1.2em]"
>
  <a
    href="/projects"
    data-sveltekit-reload
    class="inline-block px-[4px] py-[2px] no-underline transition-colors"
    class:font-semibold={isActive("/projects", $page.url.pathname)}
    style:color={isActive("/projects", $page.url.pathname)
      ? "var(--color-1, #5a5a5a)"
      : "var(--link-color, #111)"}
  >
    projects
  </a>
  
  <img src="/favicon.png" alt="" class="inline max-w-8" />

  <a
    href="/"
    class="inline-block px-[4px] py-[2px] no-underline transition-colors"
    class:font-semibold={isActive("/", $page.url.pathname)}
    style:color={isActive("/", $page.url.pathname)
      ? "var(--color-1, #5a5a5a)"
      : "var(--link-color, #111)"}
  >
    krisenstab
  </a>

  <a
    href="mailto:hi@thometnanni.net"
    class="inline-block px-[4px] py-[2px] no-underline transition-colors"
    style="color: var(--link-color, #111);"
  >
    contact
  </a>
</header>
