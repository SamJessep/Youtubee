<script>
export let data;
import { fly } from 'svelte/transition';

</script>

<div>
  <h2 transition:fly="{{ y: -200, duration: 800 }}">{data.title}</h2>
  <img src={data.Image.url} transition:fly="{{ x: -1000, duration: 1000 }}"/>
  <pre transition:fly="{{ y: 200, duration: 1000 }}">{data.description}</pre>
</div>

<style>
h2{
  text-align: center;
  font-weight: bold;
  font-size: large;
}

pre{
  white-space: pre-wrap;
}

img{
	margin: 0 auto;
	display: block;
	max-width: 400px;
}

</style>
