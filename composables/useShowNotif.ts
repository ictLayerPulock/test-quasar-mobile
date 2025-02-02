export const useShowNotif = ($q: any, icon: any, message: any) => {
	$q.notify({
		color: "primary",
		icon: icon,
		message: message,
		position: "bottom-right",
		timeout: 1000
	})
}