<template>
	<section>
		<q-card>
			<q-responsive :ratio="3 / 4" style="width: 100%;">
				<q-carousel v-model="slide" swipeable animated thumbnails infinite autoplay>
					<q-carousel-slide v-for="(item, index) in props.image" :key="item" :name="index + 1"
						style="width: 100%;" :srcset="_srcset.srcset" :height="height" :sizes="_srcset.sizes"
						:lazy-src="img(src, { width: '100vw', quality: 70 })" 
						:img-src="img(item, { height })"
						:alt="props.name"
						:title="props.name" />
				</q-carousel>
			</q-responsive>
			<q-btn v-if="props.video != null" dense round flat size="md" class="absolute bg-grey-2" icon="play_circle"
				color="primary" style="top: 12px; right: 52px; z-index: 60; opacity: 75%" aria-label="Video"
				@click="videoModal = true" />
			<q-btn dense round flat size="md" class="absolute bg-grey-2" icon="share" color="primary"
				style="top: 12px; right: 12px; z-index: 60; opacity: 75%" aria-label="Share" @click="startShare()" />
		</q-card>
	</section>
	<section>
		<q-dialog v-model="videoModal" position="bottom" seamless>
			<q-card class="shadow-up-5">
				<LazyProductVideoModalM :video="props.video" />
				<q-card-actions class="justify-center row q-pa-sm gradient-bottom">
					<q-btn v-close-popup outline label="Close" color="primary" style="width: 120px" />
				</q-card-actions>
			</q-card>
		</q-dialog>
	</section>
</template>
<script setup>
const slide = ref(1)
const videoModal = useVideoModal();
const props = defineProps({
	height: {
		type: [Number, String],
		default: 500
	},
	src: {
		type: String,
		default: "/placeholder.gif"
	},
	name: {
		type: String,
		default: () => "",
		required: false,
	},
	image: {
		type: Array,
		default: () => [],
		required: false,
	},
	video: {
		type: String,
		default: () => null,
		required: false,
	},
	customerIsAuth: {
		type: Boolean,
		default: () => false,
		required: false,
	},
	showShareBtn: {
		type: Boolean,
		default: () => false,
		required: false,
	},
})

const img = useImage()
const _srcset = computed(() => {
	return img.getSizes(props.src, {
		sizes: "xs:100vw sm:100vw md:100vw lg:100vw xl:100vw",
		modifiers: {
			format: "webp",
			quality: 70,
			height: props.height
		}
	})
})

const customerID = useCustomerID()
// const { share } = useShare()

// const startShare = () => {
// 	if (customerID.value != "") {
// 		share({
// 			title: "Share To Earn",
// 			text: "Share URL",
// 			url: location.href + "?ref=" + customerID.value,
// 		})
// 	} else {
// 		share({
// 			title: "Share Product URL",
// 			text: "Share URL",
// 			url: location.href,
// 		})
// 	}
// }
</script>