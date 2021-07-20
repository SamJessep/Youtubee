<script>
export let data;
import { fly } from 'svelte/transition';

</script>

<div>
  <h2 transition:fly="{{ y: -200, duration: 800 }}">{data.title}</h2>
  <img src={data.Image.url} alt={data.title} transition:fly="{{ x: -1000, duration: 1000 }}"/>
  <pre transition:fly="{{ y: 200, duration: 1000 }}">{data.description}</pre>
</div>

<style>
h2{
  text-align: center;
  font-weight: bold;
  font-size: large;
  margin: 1rem 0;
}

pre{
  white-space: pre-wrap;
  padding: 0;
  padding-top: 1rem;
  background-color: transparent;
}

img{
	margin: 0 auto;
	display: block;
  max-width: 100%;
  max-height: 50vh;
  box-shadow: rgb(38 57 77) 0px 20px 30px -10px;
  border-radius: 10px;
}

</style>
