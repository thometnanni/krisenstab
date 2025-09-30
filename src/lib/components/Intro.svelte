<script>
  const hour = new Date().getHours();
  let greetingMessage =
    hour < 6
      ? "Good evening"
      : hour < 12
        ? "Good morning"
        : hour < 18
          ? "Good afternoon"
          : "Good evening";
</script>

<section class="intro">
  <p>{greetingMessage},</p>
</section>

<style>
</style>
