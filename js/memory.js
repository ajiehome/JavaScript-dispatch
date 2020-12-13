// document.onload = function() {
	// 已使用内存数
	var used_memory_size = 0;
	// 内存初始化
	var memory = new Array(1024).fill(0);
	// 内存使用详情
	var memory_detail = new Array();

	//内存占用，并且创建使用记录memory_detail，以及内存使用数
	function occupy_memory(pid, start_index, memory_size) {
		for (let i = start_index; i < (start_index + memory_size); i++) {
			memory[i] = 1;
		}
		memory_detail.push(createJSON(pid, start_index, start_index + memory_size))
		used_memory_size += memory_size;
		upUI();
		return true;
	}

	//释放内存，并且删除内存的使用记录memory_detail，以及内存使用数
	function freed_memory(pid, start_index, memory_size) {
		for (let i = start_index; i < (start_index + memory_size); i++) {
			memory[i] = 0;
		}
		for (let i = 0; i < memory_detail.length; i++) {
			if (memory_detail[i].pid == pid) {
				memory_detail.splice(i, 1)
			}
		}
		used_memory_size -= memory_size; //减少
		upUI();
		return true;
	}

	//创建一个数据方法，创建使用对象
	function createJSON(pid, start_index, end_index) {
		return json = {
			"pid": pid,
			"start_index": start_index,
			"end_index": end_index
		};
	}
	
	function upUI(){
		let much = Math.floor(used_memory_size/1024*100) ;
		console.log(used_memory_size/1024)
		let domA = document.getElementById("progress-bar");
		domA.setAttribute("aria-valuenow",much);
		domA.style.width = much +'%';
		domA.innerText= much+'%';
	}

// }