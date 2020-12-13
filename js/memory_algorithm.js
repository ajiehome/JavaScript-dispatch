// document.onload = function() {
	var index_all = 0;
	var switchMemory = 1;

	/**
	 * 首次使用算法
	 */
	function firstFit(pcb) {
		let index = -1;
		let count = 0;
		for (var i = 0; i < memory.length; i++) {
			if (memory[i] == 0) {
				if (index == -1) {
					index = i;
				}
				count++;
			} else {
				if (count >= pcb.memory_size) {
					break;
				} else {
					index = -1;
					count = 0;
				}
			}
		}
		if (index != -1 && count >= pcb.memory_size) {
			occupy_memory(pcb.pid, index, pcb.memory_size);
			index_all = index;
			pcb.start_memory = index;
			return true;
		}

		return false;
	}
	/**
	 * 循环首次
	 */
	function nextFit(pcb) {
		let index = -1;
		let count = 0;
		for (var i = index_all; i < memory.length; i++) {
			if (memory[i] == 0) {
				if (index == -1) {
					index = i;
				}
				count++;
			} else {
				if (count >= pcb.memory_size) {
					break;
				} else {
					index = -1;
					count = 0;
				}
			}
		}
		if (index != -1 && count >= pcb.memory_size) {
			occupy_memory(pcb.pid, index, pcb.memory_size);
			index_all = index;
			return true;
		}
		return false;
	}
	/**
	 * 最佳适应
	 */
	function baseFit(pcb) {
		let index = -1;
		let count = 0;
		let detail = null;
		for (var i = 0; i < memory.length; i++) {
			if (memory[i] == 0) {
				if (index == -1) {
					index = i;
				}
				count++;
			} else {
				if (count >= pcb.memory_size) {
					//寻找最小区间
					if (detail == null) {
						detail = createTempMemory(index, count);
					} else {
						if (detail.count > count) {
							detail = createTempMemory(index, count);
						}
					}
				}
				index = -1;
				count = 0;
			}
		}

		if (detail != null) {
			occupy_memory(pcb.pid, detail.index, pcb.memory_size);
			index_all = index;
			return true;
		} else {
			if (index != -1 && count >= pcb.memory_size) {
				occupy_memory(pcb.pid, index, pcb.memory_size);
				index_all = index;
				return true;
			}
		}

		return false;
	}
	/**
	 * 最坏适应
	 */
	function worstFit(pcb) {
		let index = -1;
		let count = 0;
		let detail = null;
		for (var i = 0; i < memory.length; i++) {
			if (memory[i] == 0) {
				if (index == -1) {
					index = i;
				}
				count++;
			} else {
				if (count >= pcb.memory_size) {
					//寻找最大区间
					if (detail == null) {
						detail = createTempMemory(index, count);
					} else {
						if (detail.count < count) {
							detail = createTempMemory(index, count);
						}
					}
				}
				index = -1;
				count = 0;
			}
		}

		if (detail != null) {
			occupy_memory(pcb.pid, detail.index, pcb.memory_size);
			index_all = index;
			return true;
		} else {
			if (index != -1 && count >= pcb.memory_size) {
				occupy_memory(pcb.pid, index, pcb.memory_size);
				index_all = index;
				return true;
			}
		}
		return false;
	}
	/**
	 * 记录一个合适的区间
	 * @param {Object} index 开始索引
	 * @param {Object} count 长度
	 */
	function createTempMemory(index, count) {
		return detail = {
			"index": index,
			"count": count
		}
	}

// }
