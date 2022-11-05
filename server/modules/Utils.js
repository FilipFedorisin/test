class Utils {
	static async allResolved(promises) {
		return (await Promise.allSettled(promises))
			.filter(e => e.status === "fulfilled")
			.map(e => e.value);
	}
}

module.exports = {Utils};