/**
 * sticky-note:
 * a sticky note that visually displays the
 * title, description, and edit date
 * of a note in the database
 */
Vue.component('sticky-note', {
	props: {

		/**
		 * a JSON string representation of the $note object from index.php
		 * computed values are computed by parsing the JSON string into a js object
		 */
		info: {
			type: String,
			required: true
		},
	},

	template:
	/*html*/
	`
	<div v-if="!selected" :class="['relative w-72 text-black min-h-[100px] m-4 p-4 shadow-lg', color]">
    	<form action="./database/delete.php" method="post">
        	<input type="hidden" name="id" :value="id">
        	<button class="float-right font-bold text-yellow-800 hover:text-red-600">✕</button>
    	</form>
    	<div class="mb-2.5 font-bold">
        	<a class="hover:text-yellow-900" :href="url">
            	{{ title }}
        	</a>
    	</div>
    	<div class="mb-5 whitespace-pre-line">{{ description }}</div>
    	<small class="absolute bottom-2 right-3">{{ create_date }}</small>
	</div>
	`,

	data() {
		return {
			colors: [
				/* yellow */ 'bg-yellow-300',
				/* blue */ 'bg-sky-200',
				/* pink */ 'bg-rose-300',
			],
		}
	},

	computed: {

		/**
		 * computes a js object by parsing the 'info' prop from JSON to javascript
		 * @returns Object parsedInfo
		 */
		parsedInfo() {
			return JSON.parse(this.info);
		},

		/**
		 * computes the id of the note
		 * @returns String id
		 */
		id() {
			return this.parsedInfo.id;
		},

		/**
		 * computes the title of the note
		 * @returns String title
		 */
		title() {
			return this.parsedInfo.title;
		},

		/**
		 * computes the description/body text of the note
		 * @returns String description
		 */
		description() {
			return this.parsedInfo.description;
		},

		/**
		 * computes the create/edit date of the note
		 * @returns String create_date
		 */
		create_date() {
			return this.parsedInfo.create_date;
		},

		/**
		 * computes the tailwind css class keywords for the sticky note color
		 * by taking the modulus of the note id and the size of the array
		 * containing acceptable colors
		 * @returns String tailwindColor
		 */
		color() {
			return this.colors[this.id % Object.keys(this.colors).length];
		},

		/**
		 * computes the relative url of the note
		 * @returns String url
		 */
		url() {
			return "?id=" + this.id;
		},

		/**
		 * computes if the note is currently selected/active in the editor
		 * @returns Boolean selected
		 */
		selected() {
			return (window.location.href.indexOf(this.url) > -1); 
		},
	}
});

/**
 * note-editor:
 * A form that allows the user to add notes
 * and edit notes in the database
 */
Vue.component('note-editor', {
	props: {
		/**
		 * a JSON string representation of the $currentNote object from index.php
		 * computed values are computed by parsing the info in this prop
		 */
		info: {
			type: String,
			required: true
		},

		last_id: {
			type: Number,
			required: true
		}
	},

	template:
	/*html*/
	`
	<form class="absolute top-16 left-0 right-0 z-50 w-80 p-3 mx-auto bg-orange-900 shadow-xl rounded-b-2xl"
		  :onsubmit="submitEdit" action="./database/create.php" method="post">
        <input type="hidden" name="id" :value="this.id">
        <input :class="['block px-5 py-5 w-full mb-15 font-bold placeholder-slate-500', color]"
               type="text" name="title" placeholder="Note title" autocomplete="off"
               :value="this.title">
        <textarea :class="['block px-5 py-5 w-full h-48 mb-15 placeholder-slate-500', color]"
                  name="description" cols="30" rows="4" placeholder="Note Description"
        >{{ this.description }}</textarea>
        <edit-button></edit-button>
    </form>
	`,

	data() {
		return {
			colors: [
				/* yellow */ 'bg-yellow-300',
				/* blue */ 'bg-sky-200',
				/* pink */ 'bg-rose-300',
			],
		}
	},

	computed: {
		/**
		 * computes a js object by parsing the 'info' prop from JSON to javascript
		 * @returns Object parsedInfo
		 */
		parsedInfo() {
			return JSON.parse(this.info);
		},

		/**
		 * computes the id of the note
		 * @returns String id
		 */
		id() {
			return this.parsedInfo.id;
		},

		/**
		 * computes the title of the note
		 * @returns String title
		 */
		title() {
			return this.parsedInfo.title;
		},

		/**
		 * computes the description/body text of the note
		 * @returns String description
		 */
		description() {
			return this.parsedInfo.description;
		},

		/**
		 * computes the tailwind css class keywords for the sticky note color
		 * by taking the modulus of the note id and the size of the array
		 * containing acceptable colors
		 * @returns String tailwindColor
		 */
		color() {
			if(this.id === '') {
				return this.colors[(this.last_id + 1) % Object.keys(this.colors).length]
			}
			return this.colors[this.id % Object.keys(this.colors).length];
		},
		
		/**
		 * computes the text to display on the submit button
		 * if the note is not yet in the database, display 'Add Note'
		 * if the note is already in the database, display 'Update Note'
		 * @returns String buttonText
		 */
		buttonText() {
			return (this.id == '') ? 'Add Note' : 'Update Note';
		}
	},

});

Vue.component('edit-button', {
	template:
	/*html*/
	`
	<button class="block my-2 mb-15 p-4 w-full bg-yellow-800 hover:bg-yellow-700 rounded-md text-yellow-200 font-bold">
        {{ buttonText }}
    </button>
	`,

	computed: {
		buttonText() {
			return (window.location.href.indexOf('?id=') > -1) ? 'Update Note' : 'Add Note';
		}
	}
});

/**
 * Vue app: app
 */
var app = new Vue({
	el: "#notes-app",
	data: {
		adding: false
	},
	computed: {
		showEditor() {
			return this.adding || (window.location.href.indexOf('?id=') > -1);
		}
	}
});