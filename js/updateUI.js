// document.onload = function() {
	function updateUIALL() {
		document.getElementById("system_run_time_all").innerText = system_run_time_all;
		let run_queue_dom = document.getElementById("run_queue");
		let create_queue_dom = document.getElementById("create_queue");
		let ready_queue_dom = document.getElementById("ready_queue");
		let block_queue_dom = document.getElementById("block_queue");
		let hang_queue_dom = document.getElementById("hang_queue");
		let finish_queue_dom = document.getElementById("finish_queue");

		run_queue_dom.innerHTML = "";
		create_queue_dom.innerHTML = "";
		ready_queue_dom.innerHTML = "";
		block_queue_dom.innerHTML = "";
		hang_queue_dom.innerHTML = "";
		finish_queue_dom.innerHTML = "";

		for (let i = 0; i < run_queue.length; i++) {
			let pcb = run_queue[i];
			let item =
				'<div>' +
				'<span class="span1 item_margin">' + pcb.process_name + '</span>' +
				'<span class="span2 item_margin">' + pcb.pid + '</span>' +
				'<span class="span3 item_margin">' + pcb.rank_process + '</span>' +
				'<span class="span4 item_margin">' + pcb.arrivals_time + '</span>' +
				'<span class="span5 item_margin">' + pcb.need_time + '</span>' +
				'<span class="span6 item_margin">' + pcb.used_time + '</span>' +
				'<span class="span7 item_margin">' + '运行中' + '</span>' +
				'<span class="span8 item_margin">' + pcb.start_memory + '</span>' +
				'<span class="span9 item_margin">' + pcb.memory_size + '</span>' +
				'<span class="span10 item_margin">' + pcb.process_level + '</span>' +
				'<span class="span11 item_margin"><button onclick="hangProcess(' + i + ',' + 0 + ')">挂起</button></span>' +
				'<span class="span12 item_margin"><button onclick="blockProcess(' + i + ')">阻塞</button></span>' +
				'</div>';
			run_queue_dom.innerHTML += item;
		}

		for (let i = 0; i < create_queue.length; i++) {
			let pcb = create_queue[i];
			let item =
				'<div>' +
				'<span class="span1 item_margin">' + pcb.process_name + '</span>' +
				'<span class="span2 item_margin">' + pcb.pid + '</span>' +
				'<span class="span3 item_margin">' + pcb.rank_process + '</span>' +
				'<span class="span4 item_margin">' + pcb.arrivals_time + '</span>' +
				'<span class="span5 item_margin">' + pcb.need_time + '</span>' +
				'<span class="span6 item_margin">' + pcb.used_time + '</span>' +
				'<span class="span7 item_margin">' + '等待资源' + '</span>' +
				'<span class="span8 item_margin">' + pcb.start_memory + '</span>' +
				'<span class="span9 item_margin">' + pcb.memory_size + '</span>' +
				'<span class="span10 item_margin">' + pcb.process_level + '</span>' +
				'<span class="span11 item_margin"><button class="hidden_button">挂起</button></span>' +
				'<span class="span12 item_margin"><button class="hidden_button">运行</button></span>' +
				'</div>';
			create_queue_dom.innerHTML += item;
		}
		for (let i = 0; i < ready_queue.length; i++) {
			let pcb = ready_queue[i];
			let item =
				'<div>' +
				'<span class="span1 item_margin">' + pcb.process_name + '</span>' +
				'<span class="span2 item_margin">' + pcb.pid + '</span>' +
				'<span class="span3 item_margin">' + pcb.rank_process + '</span>' +
				'<span class="span4 item_margin">' + pcb.arrivals_time + '</span>' +
				'<span class="span5 item_margin">' + pcb.need_time + '</span>' +
				'<span class="span6 item_margin">' + pcb.used_time + '</span>' +
				'<span class="span7 item_margin">' + '等待CPU' + '</span>' +
				'<span class="span8 item_margin">' + pcb.start_memory + '</span>' +
				'<span class="span9 item_margin">' + pcb.memory_size + '</span>' +
				'<span class="span10 item_margin">' + pcb.process_level + '</span>' +
				'<span class="span11 item_margin"><button onclick="hangProcess(' + i + ',' + 1 + ')">挂起</button></span>' +
				'<span class="span12 item_margin"><button onclick="runProcess(' + i + ')">运行</button></span>' +
				'</div>';
			ready_queue_dom.innerHTML += item;
		}
		for (let i = 0; i < block_queue.length; i++) {
			let pcb = block_queue[i];
			let item =
				'<div>' +
				'<span class="span1 item_margin">' + pcb.process_name + '</span>' +
				'<span class="span2 item_margin">' + pcb.pid + '</span>' +
				'<span class="span3 item_margin">' + pcb.rank_process + '</span>' +
				'<span class="span4 item_margin">' + pcb.arrivals_time + '</span>' +
				'<span class="span5 item_margin">' + pcb.need_time + '</span>' +
				'<span class="span6 item_margin">' + pcb.used_time + '</span>' +
				'<span class="span7 item_margin">' + '进程阻塞' + '</span>' +
				'<span class="span8 item_margin">' + pcb.start_memory + '</span>' +
				'<span class="span9 item_margin">' + pcb.memory_size + '</span>' +
				'<span class="span10 item_margin">' + pcb.process_level + '</span>' +
				'<span class="span11 item_margin"><button onclick="hangProcess(' + i + ',' + 2 + ')">挂起</button></span>' +
				'<span class="span12 item_margin"><button onclick="notifyProcess(' + i + ')">唤醒</button></span>' +
				'</div>';
			block_queue_dom.innerHTML += item;
		}
		for (let i = 0; i < hang_queue.length; i++) {
			let pcb = hang_queue[i];
			let content = null;
			switch (parseInt(pcb.hang_type)) {
				case 0:
					content = '运行挂起';
					break;
				case 1:
					content = '就绪挂起';
					break;
				case 2:
					content = '阻塞挂起';
					break;
			}
			let item =
				'<div>' +
				'<span class="span1 item_margin">' + pcb.process_name + '</span>' +
				'<span class="span2 item_margin">' + pcb.pid + '</span>' +
				'<span class="span3 item_margin">' + pcb.rank_process + '</span>' +
				'<span class="span4 item_margin">' + pcb.arrivals_time + '</span>' +
				'<span class="span5 item_margin">' + pcb.need_time + '</span>' +
				'<span class="span6 item_margin">' + pcb.used_time + '</span>' +
				'<span class="span7 item_margin">' + content + '</span>' +
				'<span class="span8 item_margin">' + pcb.start_memory + '</span>' +
				'<span class="span9 item_margin">' + pcb.memory_size + '</span>' +
				'<span class="span10 item_margin">' + pcb.process_level + '</span>' +
				'<span class="span11 item_margin"><button class="hidden_button">挂起</button></span>' +
				'<span class="span12 item_margin"><button onclick="activateProcess(' + i + ')">激活</button></span>' +
				'</div>';
			hang_queue_dom.innerHTML += item;
		}
		for (let i = 0; i < finish_queue.length; i++) {
			let pcb = finish_queue[i];
			let item =
				'<div>' +
				'<span class="span1 item_margin">' + pcb.process_name + '</span>' +
				'<span class="span2 item_margin">' + pcb.pid + '</span>' +
				'<span class="span3 item_margin">' + pcb.rank_process + '</span>' +
				'<span class="span4 item_margin">' + pcb.arrivals_time + '</span>' +
				'<span class="span5 item_margin">' + pcb.need_time + '</span>' +
				'<span class="span6 item_margin">' + pcb.used_time + '</span>' +
				'<span class="span7 item_margin">' + '等待CPU' + '</span>' +
				'<span class="span8 item_margin">' + pcb.start_memory + '</span>' +
				'<span class="span9 item_margin">' + pcb.memory_size + '</span>' +
				'<span class="span10 item_margin">' + pcb.process_level + '</span>' +
				'<span class="span11 item_margin"><button class="hidden_button">挂起</button></span>' +
				'<span class="span12 item_margin"><button class="hidden_button">操作</button></span>' +
				'</div>';
			finish_queue_dom.innerHTML += item;
		}
	}

// }
