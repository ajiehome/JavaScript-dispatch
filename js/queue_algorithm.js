// document.onload = function() {
	var fragment_time = 5;
	var run_time = 0;

	/**
	 * 执行算法，先来先服务
	 */
	function executeFcfs() {
		system_run_time_all++;
		isReadyProcess(); // 进程检测就绪
		if (run_queue.length == 0) {
			if (!resultFcfs()) {
				return;
			}
		}

		run_queue[0].used_time += 1;

		if (run_queue[0].used_time >= run_queue[0].need_time) {
			finish_queue.push(run_queue[0]);
			freed_memory(run_queue[0].pid,run_queue[0].start_memory,run_queue[0].memory_size);
			run_queue.splice(0, 1);
		}
	}
	/**
	 * 高优先级
	 */
	function executePriority() {
		console.log("系统叠加")
		system_run_time_all++;
		isReadyProcess();
		if (run_queue.length == 0) {
			if (!resultPriority()) {
				return;
			}
		}
		run_queue[0].used_time += 1;
		if (run_queue[0].used_time >= run_queue[0].need_time) {
			finish_queue.push(run_queue[0]);
			freed_memory(run_queue[0].pid,run_queue[0].start_memory,run_queue[0].memory_size);
			run_queue.splice(0, 1);
		}
	}
	/**
	 * 高相应比
	 */
	function executeHRRN() {
		system_run_time_all++;
		isReadyProcess();
		if (run_queue.length == 0) {
			if (!resultHRRN()) {
				return;
			}
		}
		run_queue[0].used_time += 1;

		if (run_queue[0].used_time >= run_queue[0].need_time) {
			finish_queue.push(run_queue[0]);
			freed_memory(run_queue[0].pid,run_queue[0].start_memory,run_queue[0].memory_size);
			run_queue.splice(0, 1);
		}
	}
	/**
	 * 碎片轮转
	 */
	function executeRR() {
		system_run_time_all++;
		isReadyProcess();

		if (run_queue.length == 0) {
			if (!resultRR()) {
				return;
			}
		}
		run_queue[0].used_time += 1;
		run_time++;

		if (run_queue[0].used_time >= run_queue[0].need_time) {
			finish_queue.push(run_queue[0]);
			run_queue.splice(0, 1);
			run_time = 0;
		} else {
			if (run_time >= fragment_time * run_queue[0].process_level) {
				ready_queue.push(run_queue[0]);
				freed_memory(run_queue[0].pid,run_queue[0].start_memory,run_queue[0].memory_size);
				run_queue.splice(0, 1);
				run_time = 0;
			}
		}

	}
	/**
	 * 多级反馈队列
	 */
	function executeMFQ() {
		system_run_time_all++;
		isReadyProcess();
		if (run_queue.length == 0) {
			if (!resultMFQ()) {
				return;
			}
		}
		run_queue[0].used_time += 1;
		run_time++;

		if (run_queue[0].used_time >= run_queue[0].need_time) {
			finish_queue.push(run_queue[0]);
			run_queue.splice(0, 1);
			run_time = 0;
		} else {
			if (run_time >= fragment_time * run_queue[0].process_level) {
				if (run_queue[0].process_level < 3) {
					run_queue[0].process_level++;
				}
				ready_queue.push(run_queue[0]);
				freed_memory(run_queue[0].pid,run_queue[0].start_memory,run_queue[0].memory_size);
				run_queue.splice(0, 1);
				run_time = 0;
			}
		}
	}

// }
