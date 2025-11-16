<script>
  import { page } from "$app/stores";
  const isActive = (href, pathname) =>
    href === pathname || (href !== "/" && pathname.startsWith(href));
</script>

<header
  class="sticky z-100 top-0 w-full text-right text-[1.2em] sm:text-[1.1em] sm:leading-[1.2em] leading-[1.2em]"
>
  <a
    href="/projects"
    data-sveltekit-reload
    class="  inline-block px-[4px] py-[2px] no-underline transition-colors"
    style:color={isActive("/projects", $page.url.pathname) ? "#000" : "#ccc"}
    style:font-weight="500"
  >
    projects
  </a>

  <img src="/favicon.png" alt="" class="  inline max-w-8" />

  <a
    href="/"
    class="  inline-block px-[4px] py-[2px] no-underline transition-colors"
    style:color={isActive("/", $page.url.pathname) ? "#000" : "#ccc"}
    style:font-weight="500"
  >
    krisenstab
  </a>

  <a
    href="mailto:hi@thometnanni.net"
    class=" inline-block px-[4px] py-[2px] no-underline transition-colors"
    style="color: #ccc; font-weight: 500;"
  >
    contact
  </a>
</header>
