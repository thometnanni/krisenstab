<script>
  let greetingMessage =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 18
        ? "Good afternoon"
        : "Good evening";
</script>

<section class="intro">
  <p>{greetingMessage},</p>
</section>

<style>
</style>
