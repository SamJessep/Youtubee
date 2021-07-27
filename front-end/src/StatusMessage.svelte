<script>
  export let message;
  export let state = "success"
  const states = ["success", "error", "warning", "info"]
</script>

<div class={state}>
  {@html message}
</div>

<style>

  div{
    margin-top: 0.5rem;
    border: solid 2px;
    padding: 0.5rem;
    border-radius: 0.5rem;
    color:rgb(31, 31, 31);
  }

  .error{
    border-color: rgb(255, 38, 0);
    background-color: rgb(253, 198, 198);
  }

  .success{
    border-color: rgb(0, 133, 55);
    background-color: rgb(165, 255, 165);
  }

  .warning{
    border-color: rgb(245, 153, 10);
    background-color: rgb(255, 225, 184);
  }

  .info{
    border-color: rgb(0, 138, 193);
    background-color: rgb(160, 220, 255);
  }
</style>