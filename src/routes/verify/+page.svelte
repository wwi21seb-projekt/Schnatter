<script lang="ts">
	let verifyInput: string = '';

	function handleInput(event: Event) {
		const newValue = (event.target as HTMLInputElement).value.replace(/\D/g, '');
		verifyInput = newValue.slice(0, 6);
	}

	function handleSubmit() {
		console.log('test');
	}
	$: formCorrectCode = verifyInput.length == 6;
</script>

<main class="flex justify-center items-center w-screen h-screen">
	<div class="card w-[40vw] h-[50vh] p-5">
		<h2 class="h2">Verify your Account</h2>

		<form class="w-full h-full flex flex-col items-center justify-around">
			<p>
				Please verify your account. You have received an email to the specified email address!
				Please enter the code it contains here:
			</p>
			<input
				bind:value={verifyInput}
				on:input={handleInput}
				class="input variant-form-material w-[80px]"
				placeholder="XXXXXX"
			/>
			<div class="flex flex-row items-center justify-around w-2/5">
				<a href="/"><button class="btn variant-filled-surface">Ask later</button></a>
				<button
					on:click={handleSubmit}
					disabled={!formCorrectCode}
					class="btn variant-filled-primary">Verify</button
				>
			</div>
		</form>
	</div>
</main>
