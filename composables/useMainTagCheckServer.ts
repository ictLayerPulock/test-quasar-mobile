export const useMainTagCheckServer = (item: any) => {
	for (const key in item.fg_tag_arr) {
		if (item.fg_tag_arr[key].fg_tag_name == "main") {
			return true
		}
	}
	return false
}
