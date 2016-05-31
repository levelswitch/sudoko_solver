let kernel_default = [-1,-1,-1,-1,8,-1,-1,-1,-1];
let kernel = [0,1,0, 1,-4,1, 0,1,0];

function onLoad(){
    let video = document.querySelector("#videoElement");
    let video_height = 300;
    let video_width = 400;
    let canvas_one_ctx = document.getElementById("canvas_one").getContext("2d");
    let canvas_two_ctx = document.getElementById("canvas_two").getContext("2d");
    let canvas_three_ctx = document.getElementById("canvas_three").getContext("2d");
    reset();
    video.addEventListener("play", function(){
	frameCall();
    }, false);
    
    let spread = 11;
    
    function frameCall(){
	canvas_one_ctx.drawImage(video, 0, 0, video_width, video_height);
	let frame = canvas_one_ctx.getImageData(0, 0, video_width, video_height);

	let data_length = frame.data.length / 4;

	let greyed_frame_data = [];
	for (let pixel_index = 0; pixel_index < data_length; pixel_index++){
	    let r = frame.data[pixel_index * 4 + 0];
	    let g = frame.data[pixel_index * 4 + 1];
	    let b = frame.data[pixel_index * 4 + 2];

	    let y = r * 0.3 + g * 0.59 + b * 0.11;
	    greyed_frame_data[pixel_index] = y;
	}

	function apply_kernel(pixel_position){
	    /*
	      012
	      3C5
	      678
	    */
	    let temp_0 =  (pixel_position - video_width - 1);
	    let pixel_0 = (temp_0 > -1 ) ? greyed_frame_data[temp_0] : greyed_frame_data[pixel_position];

	    let temp_1 = (pixel_position - video_width);
	    let pixel_1 = (temp_1 > -1 ) ? greyed_frame_data[temp_1] : greyed_frame_data[pixel_position];

	    let temp_2 = (pixel_position - video_width + 1);
	    let pixel_2 = (temp_2 > -1 ) ? greyed_frame_data[temp_2] : greyed_frame_data[pixel_position];

	    let temp_3 = (pixel_position - 1);
	    let pixel_3 = (temp_3 > -1 ) ? greyed_frame_data[temp_3] : greyed_frame_data[pixel_position];

	    let pixel_C = greyed_frame_data[pixel_position];

	    let temp_5 = (pixel_position + 1);
	    let pixel_5 = (temp_1 < 120000 ) ? greyed_frame_data[temp_5] : greyed_frame_data[pixel_position];

	    let temp_6 = (pixel_position + video_width - 1);
	    let pixel_6 = (temp_6 < 120000 ) ? greyed_frame_data[temp_6] : greyed_frame_data[pixel_position];

    	    let temp_7 = (pixel_position + video_width);
	    let pixel_7 = (temp_7 < 120000   ) ? greyed_frame_data[temp_7] : greyed_frame_data[pixel_position];

	    let temp_8 = (pixel_position - video_width);
	    let pixel_8 = (temp_8 < 120000 ) ? greyed_frame_data[temp_8] : greyed_frame_data[pixel_position];

	    let accu = (pixel_0 * kernel[0]) +
		(pixel_1 * kernel[1]) +
		(pixel_2 * kernel[2]) +
		(pixel_3 * kernel[3]) +
		(pixel_C * kernel[4]) +
		(pixel_5 * kernel[5]) +
		(pixel_6 * kernel[6]) +
		(pixel_7 * kernel[7]) +
		(pixel_8 * kernel[8]);
		
		

	    frame.data[pixel_position * 4 + 0] = accu;
	    frame.data[pixel_position * 4 + 1] = accu;
	    frame.data[pixel_position * 4 + 2] = accu;	   
	    
	}

	for(let i=0; i<120000; i++){
	    apply_kernel(i);
	}

	canvas_three_ctx.putImageData(frame, 0, 0);

	let original_frame = canvas_one_ctx.getImageData(0,0,400,300);
	for(let pixel_index=0; pixel_index < data_length; pixel_index++){
	    let lux = frame.data[pixel_index * 4];
	    if(lux > 55){
		original_frame.data[pixel_index * 4 + 0] += lux;
		original_frame.data[pixel_index * 4 + 1] = 0;
		original_frame.data[pixel_index * 4 + 2] = 0;
	    }
	    
	}

	canvas_two_ctx.putImageData(original_frame,0,0);
	
	setTimeout(function(){
	    frameCall();
	}, 0);
    }
 
    navigator.getUserMedia = navigator.getUserMedia
	|| navigator.webkitGetUserMedia
	|| navigator.mozGetUserMedia
	|| navigator.msGetUserMedia
	|| navigator.oGetUserMedia;
 
    if (navigator.getUserMedia) {       
	navigator.getUserMedia({video: true}, handleVideo, videoError);
    }
 
    function handleVideo(stream) {
	video.src = window.URL.createObjectURL(stream);
    }
 
    function videoError(e) {
	// do something
    }

   
}
function kernel_submit(){
    let table_data = document.querySelectorAll("input[type='number']");
    for(let cell=0; cell<9; cell++){
	kernel[cell] = table_data[cell].value;
    }
}

function reset(){
    let table_data = document.querySelectorAll("input[type='number']");
    for(let cell=0; cell<9; cell++){
	kernel[cell] = kernel_default[cell];
	table_data[cell].value = kernel_default[cell];
    }
}

