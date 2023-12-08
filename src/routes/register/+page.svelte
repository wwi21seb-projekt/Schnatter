<script lang="ts">
	let currentMessage: string;
</script>

<main class=" flex flex-col justify-center items-center h-[90vh]">
	<div class="card w-[40vw] h-[80vh] p-10">
		<h1 class="h1">Register</h1>
		<div class="flex flex-col justify-around items-center h-[50vh]">
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
			>
				<p>Email</p>
				<input
					class="bg-transparent border-0 ring-0"
					name="prompt"
					id="prompt"
					placeholder="Email*"
				/>
				<button class="variant-filled-primary">Correct?</button>
			</div>
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
			>
				<p>Uname</p>
				<input
					class="bg-transparent border-0 ring-0"
					name="prompt"
					id="prompt"
					placeholder="Username*"
				/>
				<button class="variant-filled-primary">Correct?</button>
			</div>
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
			>
				<p>Nname</p>
				<input
					class="bg-transparent border-0 ring-0"
					name="prompt"
					id="prompt"
					placeholder="Nickname (Optional)"
				/>
				<button class="variant-filled-primary">Correct?</button>
			</div>
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
			>
				<p>pwd</p>
				<input
					class="bg-transparent border-0 ring-0"
					name="prompt"
					id="prompt"
					placeholder="Password"
				/>
				<button class="variant-filled-primary">Correct?</button>
			</div>
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
			>
				<p>pwd</p>
				<input
					class="bg-transparent border-0 ring-0"
					name="prompt"
					id="prompt"
					placeholder="Repeat Password*"
				/>
				<button class="variant-filled-primary">Correct?</button>
			</div>
			<div class="flex flex-row">
				<button class="btn variant-filled-surface mr-2">Cancel</button>
                <button class="btn variant-filled-primary ml-2">Register</button>
			</div>
		</div>
	</div>
</main>
