// document.onload = function() {
	var create_queue = new Array(); //等待队列
	var ready_queue = new Array(); //就绪队列
	var run_queue = new Array(); //运行队列
	var block_queue = new Array(); //阻塞队列
	var hang_queue = new Array(); //挂起队列
	var finish_queue = new Array(); //结束队列

	var process_index_all = 0; //进程创建索引
	var system_run_time_all = 0; //系统运行总时间


	/**
	 * 指定队列运行
	 * @param {Object} index 进程索引
	 */
	function runProcess(index) {
		if (ready_queue.length != 0) {
			if (run_queue.length != 0) {
				block_queue.push(run_queue[0]);
				run_queue.splice(0, 1);
			}
		}
		run_queue.push(ready_queue[index]);
		ready_queue.splice(index, 1);
	}
	/**
	 * 阻塞某个进程
	 * @param {Object} index 阻塞索引
	 */
	function blockProcess(index) {
		block_queue.push(run_queue[index]);
		run_queue.splice(index, 1);
		updateUIALL();
	}
	/**
	 * 挂起某个进程
	 * @param {Object} index 挂起索引
	 * @param {Object} hang_type 0运行挂起，1就绪挂起，2阻塞挂起
	 */
	function hangProcess(index, hang_type) {
		switch (parseInt(hang_type)) {
			case 0:
				run_queue[index].hang_type = 0;
				hang_queue.push(run_queue[index]);
				run_queue.splice(index, 1);
				break;
			case 1:
				ready_queue[index].hang_type = 1;
				hang_queue.push(ready_queue[index]);
				ready_queue.splice(index, 1);
				break;
			case 2:
				block_queue[index].hang_type = 2;
				hang_queue.push(block_queue[index]);
				block_queue.splice(index, 1);
				break;
		}
		updateUIALL();
	}
	/**
	 * 唤醒阻塞
	 * @param {Number} index 索引
	 */
	function notifyProcess(index) {
		ready_queue.push(block_queue[index]);
		block_queue.splice(index, 1);
	}

	function activateProcess(index) {
		switch (parseInt(hang_queue[index].hang_type)) {
			case 2:
				block_queue.push(hang_queue[index]);
				break;
			case 1:
			case 0:
				ready_queue.push(hang_queue[index]);
				break;
		}
		hang_queue.splice(index, 1);
		updateUIALL();
	}
	/**
	 * 给先来先服务分配进程
	 * @return {Boolean} type 是否分配成功
	 */
	function resultFcfs() {
		if (ready_queue.length != 0) {
			arrivalsTimeSort();
			run_queue.push(ready_queue[0]);
			ready_queue.splice(0, 1);

			return true;
		}
		return false;
	}

	/**
	 * 给优先级算法分配运行进程
	 * @return {Boolean} type 是否分配成功
	 */
	function resultPriority() {
		let pcb = null;
		let index = -1;
		for (var i = 0; i < ready_queue.length; i++) {
			if (pcb == null) {
				pcb = ready_queue[i];
				index = i;
			} else {
				if (pcb.rank_process < ready_queue[i].rank_process) {
					pcb = ready_queue[i];
					index = i;
				}
			}
		}
		if (pcb != null) {
			run_queue.push(pcb);
			ready_queue.splice(index, 1);
			return true;
		}
		return false;
	}
	/**
	 * 时间片轮转
	 */
	function resultRR() {
		if (ready_queue.length != 0) {
			run_queue.push(ready_queue[0]);
			ready_queue.splice(0, 1);
			return true;
		}
		return false;
	}
	/**
	 * 给高响应比创建
	 */
	function resultHRRN() {
		let hrrn = null;
		let index = -1;
		for (var i = 0; i < ready_queue.length; i++) {
			if (hrrn == null) {
				hrrn = (system_run_time_all - ready_queue[i].arrivals_time + ready_queue[i].need_time) / ready_queue[i].need_time;
				index = i;
			} else {
				let temp = (system_run_time_all - ready_queue[i].arrivals_time + ready_queue[i].need_time) / ready_queue[i].need_time;
				if (temp > hrrn) {
					hrrn = temp;
					index = i;
				}
			}
		}
		if (index != -1) {
			run_queue.push(ready_queue[index]);
			ready_queue.splice(index, 1);
			return true;
		}
		return false;
	}
	/**
	 * 分配多级反馈对立的
	 */
	function resultMFQ() {
		if (ready_queue.length != 0) {
			ready_queue.sort((o1, o2) => {
				return o2.rank_process - o1.rank_process;
			});
			ready_queue.sort((o1, o2) => {
				return o1.process_level - o2.process_level;
			});

			run_queue.push(ready_queue[0]);
			ready_queue.splice(0, 1);
			return true;
		}
		return false;
	}
	/**
	 * 根据到达实践排序
	 */
	function arrivalsTimeSort() {
		ready_queue.sort((o1, o2) => {
			return o1.arrivals_time - o2.arrivals_time;
		});
	}

	/**
	 * 就绪队列
	 */
	function isReadyProcess() {
		for (let i = 0; i < create_queue.length; i++) {
			let pcb = create_queue[i];
			let isBoolean = false;
			if (pcb.arrivals_time <= system_run_time_all) {
				switch (switchMemory) {
					case 1:
						isBoolean = firstFit(pcb);
						break;
					case 2:
						isBoolean = nextFit(pcb);
						break;
					case 3:
						isBoolean = baseFit(pcb);
						break;
					case 4:
						isBoolean = worstFit(pcb);
						break;
					default:
				}
				if (isBoolean) {
					ready_queue.push(pcb);
					create_queue.splice(i, 1);
				}
			}
		}
	}

	/**
	 * 添加一个进程
	 */
	function addProcess() {
		create_queue.push(createPCB())
	}

	/**
	 * 创建一个进程核心，PCB
	 */
	function createPCB() {
		//hang_type 0运行挂起，1就绪挂起，2阻塞挂起

		return process = {
			"process_name": '进程' + process_index_all,
			"pid": process_index_all++,
			"rank_process": Math.ceil(Math.random() * 10),
			"arrivals_time": system_run_time_all,
			"need_time": Math.ceil(Math.random() * 20),
			"used_time": 0,
			"start_memory": -1,
			"memory_size": Math.ceil(Math.random() * 100),
			"process_context": '等待',
			"process_level": 1,
			"hang_type": -1
		}
	}

// }
