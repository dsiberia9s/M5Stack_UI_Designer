var ScreenWidth = 320;
var ScreenHeight = 240;
var Char2Width = 12;
var Char3Width = 16;
var Char2Height = 20;

/* виджет UIInputbox */
$.widget("namespace.UIInputbox", {
	options: {
		x: 10,
		y: 10,
		width: 150,
		height: 50,
		layer: "default",
		caption: "Inputbox", 
		callback: "0",
		rootVar: "0",
		value: "",
		icon: "",
		signature: "int x, int y, int width, String layer, String caption, pFuncStrP callback, String* rootVar",
		blank_: false
	},

	_create: function() {
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		// устанавливаем размеры
		element.css("width", properties.width);
		element.css("height", properties.height);

		// внешний вид
		$("<div>", {class: (class_ + "-caption"), text: properties.caption + ":"}).appendTo(element); // добавляем поле caption и добавляем в него значение
		$("<div>", {class: (class_ + "-value"), text: properties.value}).appendTo(element); // аналогично

		// заготовке доп. свойства не нужны - выходим
		if (properties.blank_) 
			return; 

		// выставляем координаты
		element.css("top", properties.y);
		element.css("left", properties.x);

		// устанавливаем другие свойства
		element.data(properties); 

		// убираем лишние пробелы в signature
		properties.signature = (properties.signature).replace(new RegExp(", ","g"), ",");
		
		// делаем элемент подвиждным
		element.draggable({
			revert: "invalid", // чтоб копию за пределами экрана не кидали
			cursor: "move",
			drag: function(event, ui) {
				var X = Math.round(element.position().left);
				var Y = Math.round(element.position().top);
				properties.x = X;
				properties.y = Y;
				// если элемент брошен ниже чем высота дисплея + высота самого элемента
				if (Y > (element.parent().height() - element.height() / 2))
				{
					element.trigger("eventFamily", [null, null]);
					// прячем, затем удаляем элемент
					element.fadeOut(300, function() {
						element.remove();
					});
					return;
				}
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			},
			stop: function(event, ui) {
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			}
		});

		// клик на элемент
		element.click(function() {
			element.trigger("eventFamily", [widget, properties]);
		});
	},


	_setOption: function(key, value) {	
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		if (key === "x")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]); 
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "y")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "width")
		{
			var width = Math.round(value);
			var maxWidth = ScreenWidth - ((width > ScreenWidth) ? (properties.x * 2) : properties.x);
			width = (width <= maxWidth) ? width : maxWidth;
			properties[key] = (width < 32) ? 32 : width;
			element.css("width", properties[key]);
			// обновим значения, чтобы текст умещался согласно параметрам
			this._setOption("caption", properties.caption);
			this._setOption("value", properties.value);
		}

		else if (key === "layer")
		{
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "caption")
		{
			var k_ = Math.round(properties.width / Char2Width) - 1; // максимальное кол-во символов в надписи
			properties[key] = (value.length > k_) ? value.substring(0, k_) : value;
			$(element).find("." + class_ + "-caption").text(properties[key] + ":");
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "callback")
		{
			value = (!value) ? 0 : value;
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "value")
		{
			var length_ = value.length;
			var size_ = (properties.width - (10 * 2)) / Char2Width; // 12px per char
		    properties[key] = (length_ < size_) ? value : (value.substring((length_ - size_), length_));
			$(element).find("." + class_ + "-value").text(properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}
	},

	destroy: function() {
		this.options = null; // удаляем все свойства
	}
});

/* виджет UITextbox */
$.widget("namespace.UITextbox", {
	options: {
		x: 0,
		y: 0,
		width: 150,
		height: Char2Height,
		layer: "default",
		caption: "",
		color: "0x0000", 
		callback: "",
		rootVar: "0",
		value: "Textbox",
		icon: "",
		signature: "int x, int y, int width, int height, int color, String layer, String* rootVar",
		blank_: false
	},

	_create: function() {
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		// внешний вид
		$("<div>", {class: (class_ + "-value"), text: properties.value}).appendTo(element); 

		// устанавливаем размеры
		element.css("width", properties.width);
		element.css("height", properties.height);

		this._setOption("value", properties.value);

		// заготовке доп. свойства не нужны - выходим
		if (properties.blank_) 
			return; 

		// выставляем координаты
		element.css("top", properties.y);
		element.css("left", properties.x);

		// устанавливаем другие свойства
		element.data(properties); 

		// убираем лишние пробелы в signature
		properties.signature = (properties.signature).replace(new RegExp(", ","g"), ",");
		
		// делаем элемент подвиждным
		element.draggable({
			revert: "invalid", // чтоб копию за пределами экрана не кидали
			cursor: "move",
			drag: function(event, ui) {
				var X = Math.round(element.position().left);
				var Y = Math.round(element.position().top);
				properties.x = X;
				properties.y = Y;
				// если элемент брошен ниже чем высота дисплея + высота самого элемента
				if (Y > (element.parent().height() - element.height() / 2))
				{
					element.trigger("eventFamily", [null, null]);
					// прячем, затем удаляем элемент
					element.fadeOut(300, function() {
						element.remove();
					});
					return;
				}
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			},
			stop: function(event, ui) {
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			}
		});

		// клик на элемент
		element.click(function() {
			element.trigger("eventFamily", [widget, properties]);
		});
	},


	_setOption: function(key, value) {	
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		if (key === "x")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]); 
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "y")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "width")
		{
			var width = Math.round(value);
			var maxWidth = ScreenWidth - ((width > ScreenWidth) ? (properties.x * 2) : properties.x);
			width = (width <= maxWidth) ? width : maxWidth;
			properties[key] = (width < Char2Width) ? Char2Width : width;
			element.css("width", properties[key]);
			// обновим значения, чтобы текст умещался согласно параметрам
			this._setOption("value", properties.value);
		}

		else if (key === "height")
		{
			var height = Math.round(value);
			var maxHeight = ScreenHeight - ((height > ScreenHeight) ? (properties.y * 2) : properties.y);
			height = (height <= maxHeight) ? height : maxHeight;
			properties[key] = (height < Char2Height) ? Char2Height : height;
			element.css("height", properties[key]);
			// обновим значения, чтобы текст умещался согласно параметрам
			this._setOption("value", properties.value);
		}

		else if (key === "layer")
		{
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "value")
		{
			var N = properties.height / Char2Height; // сколько строк всего
		    var P = Math.round(properties.width / Char2Width); // символов в строке
		    var J = N * P; // всего можно уместить символов
		    value = value.substring(0, J);
		    properties[key] = value;
		    var text = "";
		    for (var n = 0; n < N; n++) {
		    	var left = n * P;
		    	var right = left + P;
		    	text += properties[key].substring(left, right);
		    	//if (n != (N - 1))  text += "\n";
		    }
			$(element).find("." + class_ + "-value").text(text);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}
	},

	destroy: function() {
		this.options = null; // удаляем все свойства
	}
});

/* виджет UIWaitingbar */
$.widget("namespace.UIWaitingbar", {
	options: {
		x: 0,
		y: 0,
		width: 150,
		height: 50,
		layer: "default",
		caption: "Waitingbar",
		color: "", 
		callback: "",
		rootVar: "0",
		value: "",
		icon: "",
		signature: "int x, int y, int width, String layer, String caption, String* rootVar",
		blank_: false
	},

	_create: function() {
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		// внешний вид
		$("<div>", {class: (class_ + "-caption"), text: properties.caption + ":"}).appendTo(element); // добавляем поле caption и добавляем в него значение
		var bar = $("<div>", {class: (class_ + "-bar"), text: properties.value}).appendTo(element);
		for (var i = 0; i < 10; i++)
		{
			if (i % 2)
				bar.append("<div class=\"" + class_ + "-bar-even\"></div>");
			else
				bar.append("<div class=\"" + class_ + "-bar-odd\"></div>");
		}

		// устанавливаем размеры
		element.css("width", properties.width);
		element.css("height", properties.height);

		this._setOption("caption", properties.caption);

		// заготовке доп. свойства не нужны - выходим
		if (properties.blank_) 
			return; 

		// выставляем координаты
		element.css("top", properties.y);
		element.css("left", properties.x);

		// устанавливаем другие свойства
		element.data(properties); 

		// убираем лишние пробелы в signature
		properties.signature = (properties.signature).replace(new RegExp(", ","g"), ",");
		
		// делаем элемент подвиждным
		element.draggable({
			revert: "invalid", // чтоб копию за пределами экрана не кидали
			cursor: "move",
			drag: function(event, ui) {
				var X = Math.round(element.position().left);
				var Y = Math.round(element.position().top);
				properties.x = X;
				properties.y = Y;
				// если элемент брошен ниже чем высота дисплея + высота самого элемента
				if (Y > (element.parent().height() - element.height() / 2))
				{
					element.trigger("eventFamily", [null, null]);
					// прячем, затем удаляем элемент
					element.fadeOut(300, function() {
						element.remove();
					});
					return;
				}
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			},
			stop: function(event, ui) {
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			}
		});

		// клик на элемент
		element.click(function() {
			element.trigger("eventFamily", [widget, properties]);
		});
	},


	_setOption: function(key, value) {	
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		if (key === "x")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]); 
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "y")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "width")
		{
			var width = Math.round(value);
			var maxWidth = ScreenWidth - ((width > ScreenWidth) ? (properties.x * 2) : properties.x);
			width = (width <= maxWidth) ? width : maxWidth;
			properties[key] = (width < 37) ? 37 : width;
			element.css("width", properties[key]);
			// обновим значения, чтобы текст умещался согласно параметрам
			this._setOption("caption", properties.caption);
		}

		else if (key === "layer")
		{
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "caption")
		{
			var k_ = Math.round(properties.width / Char2Width) - 2; // максимальное кол-во символов в надписи
			properties[key] = (value.length > k_) ? value.substring(0, k_) : value;
			$(element).find("." + class_ + "-caption").text(properties[key] + ":");
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}
	},

	destroy: function() {
		this.options = null; // удаляем все свойства
	}
});

/* виджет UIProgressbar */
$.widget("namespace.UIProgressbar", {
	options: {
		x: 0,
		y: 0,
		width: 150,
		height: 50,
		layer: "default",
		caption: "Progressbar",
		color: "", 
		callback: "",
		rootVar: "0",
		value: "70",
		icon: "",
		/* специальные свойства виджета */
		signature: "int x, int y, int width, String layer, String caption, String* rootVar",
		blank_: false
	},

	_create: function() {
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		// внешний вид
		$("<div>", {class: (class_ + "-caption"), text: properties.caption + ":"}).appendTo(element); // добавляем поле caption и добавляем в него значение
		var bar = $("<div>", {class: (class_ + "-bar")}).appendTo(element);
		bar.append("<div class=\"" + class_ + "-bar-odd\"></div>");

		// устанавливаем размеры
		element.css("width", properties.width);
		element.css("height", properties.height);

		this._setOption("caption", properties.caption);
		this._setOption("value", properties.value);

		// заготовке доп. свойства не нужны - выходим
		if (properties.blank_) 
			return; 

		// выставляем координаты
		element.css("top", properties.y);
		element.css("left", properties.x);

		// устанавливаем другие свойства
		element.data(properties); 

		// убираем лишние пробелы в signature
		properties.signature = (properties.signature).replace(new RegExp(", ","g"), ",");
		
		// делаем элемент подвиждным
		element.draggable({
			revert: "invalid", // чтоб копию за пределами экрана не кидали
			cursor: "move",
			drag: function(event, ui) {
				var X = Math.round(element.position().left);
				var Y = Math.round(element.position().top);
				properties.x = X;
				properties.y = Y;
				// если элемент брошен ниже чем высота дисплея + высота самого элемента
				if (Y > (element.parent().height() - element.height() / 2))
				{
					element.trigger("eventFamily", [null, null]);
					// прячем, затем удаляем элемент
					element.fadeOut(300, function() {
						element.remove();
					});
					return;
				}
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			},
			stop: function(event, ui) {
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			}
		});

		// клик на элемент
		element.click(function() {
			element.trigger("eventFamily", [widget, properties]);
		});
	},

	_setOption: function(key, value) {	
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		if (key === "x")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]); 
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "y")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "width")
		{
			var width = Math.round(value);
			var maxWidth = ScreenWidth - ((width > ScreenWidth) ? (properties.x * 2) : properties.x);
			width = (width <= maxWidth) ? width : maxWidth; // max
			properties[key] = (width < 37) ? 37 : width; // min
			element.css("width", properties[key]);
			// обновим значения, чтобы текст умещался согласно параметрам
			this._setOption("caption", properties.caption);
			this._setOption("value", properties.value);
		}

		else if (key === "layer")
		{
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "value")
		{
			if (!parseFloat(value))
			{
				value = 0;
			}
			value = (value < 0) ? 0 : value;
			value = (value > 100) ? 100 : value;
			properties[key] = value;
			var width = Math.round(value * (properties.width - 2)  / 100);
			var color;		
		    if (value > 79)
	      		color = "rgb(0, 204, 255)"; 
		    else if (value > 29)
	      		color = "rgb(0, 255, 102)"; 
		    else if (value > 14)
	      		color = "rgb(255, 240, 0)"; 
		    else
  				color = "rgb(255, 0, 204)";
			var barOdd = $(element).find("." + class_ + "-bar-odd");
			barOdd.css("width", width);
			barOdd.css("background-color", color);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "caption")
		{
			var k_ = Math.round(properties.width / Char2Width) - 2; // максимальное кол-во символов в надписи
			properties[key] = (value.length > k_) ? value.substring(0, k_) : value;
			$(element).find("." + class_ + "-caption").text(properties[key] + ":");
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}
	},

	destroy: function() {
		this.options = null; // удаляем все свойства
	}
});

/* виджет UISelectbox */
$.widget("namespace.UISelectbox", {
	options: {
		x: 0,
		y: 0,
		width: 150,
		height: 50,
		layer: "default",
		caption: "Selectbox", 
		callback: "0",
		rootVar: "0",
		value: "",
		icon: "",
		/* специальные свойства виджета */
		signature: "int x, int y, int width, String layer, String caption, pFuncStrP callback, String* rootVar",
		blank_: false,
		KEYBOARD_KEY_CODE: ""
	},

	_create: function() {
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		// устанавливаем размеры
		element.css("width", properties.width);
		element.css("height", properties.height);

		// внешний вид
		$("<div>", {class: (class_ + "-caption"), text: properties.caption + ":"}).appendTo(element); // добавляем поле caption и добавляем в него значение
		var valueBox = $("<div>", {class: (class_ + "-main")}).appendTo(element); // аналогично
		// стрелка "вверх"
		$("<div>", {
			class: (class_ + "-value"), 
			text: properties.value
		}).appendTo(valueBox);

		$("<input>", {
			type: "image", 
			class: (class_ + "-main-up"), 
			src: "images/arrowUp_24px.png", 
			width: "24px", 
			height: "12px", 
			click: function(){
				// чтобы стрелки работали только на элементах
				if (!properties.blank_)
				{
					$(document).trigger({type: "keydown", which: 38});
				}
			}
		}).appendTo(valueBox);

		// стрелка "вниз"
		$("<input>", {
			type: "image", 
			class: (class_ + "-main-down"), 
			src: "images/arrowDown_24px.png", 
			width: "24px", 
			height: "12px", 
			click: function(){
				if (!properties.blank_)
				{
					$(document).trigger({type: "keydown", which: 40});
				}
			}
		}).appendTo(valueBox);
		
		// заготовке доп. свойства не нужны - выходим
		if (properties.blank_) 
			return; 

		// выставляем координаты
		element.css("top", properties.y);
		element.css("left", properties.x);

		// устанавливаем другие свойства
		element.data(properties); 

		// убираем лишние пробелы в signature
		properties.signature = (properties.signature).replace(new RegExp(", ","g"), ",");
		
		// делаем элемент подвиждным
		element.draggable({
			revert: "invalid", // чтоб копию за пределами экрана не кидали
			cursor: "move",
			drag: function(event, ui) {
				var X = Math.round(element.position().left);
				var Y = Math.round(element.position().top);
				properties.x = X;
				properties.y = Y;
				// если элемент брошен ниже чем высота дисплея + высота самого элемента
				if (Y > (element.parent().height() - element.height() / 2))
				{
					element.trigger("eventFamily", [null, null]);
					// прячем, затем удаляем элемент
					element.fadeOut(300, function() {
						element.remove();
					});
					return;
				}
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			},
			stop: function(event, ui) {
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			}
		});

		// клик на элемент
		element.click(function() {
			element.trigger("eventFamily", [widget, properties]);
		});
	},


	_setOption: function(key, value) {	
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		if (key === "x")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]); 
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "y")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "width")
		{
			var width = Math.round(value);
			var maxWidth = ScreenWidth - ((width > ScreenWidth) ? (properties.x * 2) : properties.x);
			width = (width <= maxWidth) ? width : maxWidth;
			properties[key] = (width < (22 + ((5 * 2) + Char2Width))) ? (22 + ((5 * 2) + Char2Width)) : width
			element.css("width", properties[key]);
			// обновим значения, чтобы текст умещался согласно параметрам
			this._setOption("caption", properties.caption);
			this._setOption("value", properties.value);
		}

		else if (key === "layer")
		{
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "caption")
		{
			var k_ = Math.round(properties.width / Char2Width) - 1; // максимальное кол-во символов в надписи
			properties[key] = (value.length > k_) ? value.substring(0, k_) : value;
			$(element).find("." + class_ + "-caption").text(properties[key] + ":");
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "callback")
		{
			value = (!value) ? 0 : value;
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "value")
		{
			/*
			var length_ = value.length;
			var size_ = (properties.width - ((10 * 2) + Char2Width)) / Char2Width;
		    value = (length_ < size_) ? value : (value.substring((length_ - size_), length_));
		    //properties[key] = (value + "0x1F".charAt(0) + value + "0x1F".charAt(0) + selected + "0x1F".charAt(0) + "0x1E".charAt(0));
			properties[key] = value;
			$(element).find("." + class_ + "-value").text(properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
			*/
		}

		else if (key === "KEYBOARD_KEY_CODE")
		{
			var keyCode = value;
			if (keyCode == 38)
				alert("up");
			else if (keyCode == 40)
				alert("down");
		}
	},

	destroy: function() {
		this.options = null; // удаляем все свойства
	}
});

/* виджет UICheckbox */
$.widget("namespace.UICheckbox", {
	options: {
		x: 0,
		y: 0,
		width: 150,
		height: 32,
		layer: "default",
		caption: "Checkbox",
		color: "", 
		callback: "0",
		rootVar: "0",
		value: "true",
		icon: "",
		signature: "int x, int y, int width, String layer, String caption, pFuncStrP callback, String* rootVar",
		blank_: false
	},

	_create: function() {
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		// внешний вид
		var valueBox = $("<div>", {class: (class_ + "-value-box")}).appendTo(element);
		$("<div>", {class: (class_ + "-value")}).appendTo(valueBox);
		$("<div>", {class: (class_ + "-caption"), text: properties.caption}).appendTo(element); 
  
		// устанавливаем размеры
		element.css("width", properties.width);
		element.css("height", properties.height);

		this._setOption("value", properties.value);
		this._setOption("caption", properties.caption);

		// заготовке доп. свойства не нужны - выходим
		if (properties.blank_) 
			return; 

		// выставляем координаты
		element.css("top", properties.y);
		element.css("left", properties.x);

		// устанавливаем другие свойства
		element.data(properties); 

		// убираем лишние пробелы в signature
		properties.signature = (properties.signature).replace(new RegExp(", ","g"), ",");
		
		// делаем элемент подвиждным
		element.draggable({
			revert: "invalid", // чтоб копию за пределами экрана не кидали
			cursor: "move",
			drag: function(event, ui) {
				var X = Math.round(element.position().left);
				var Y = Math.round(element.position().top);
				properties.x = X;
				properties.y = Y;
				// если элемент брошен ниже чем высота дисплея + высота самого элемента
				if (Y > (element.parent().height() - element.height() / 2))
				{
					element.trigger("eventFamily", [null, null]);
					// прячем, затем удаляем элемент
					element.fadeOut(300, function() {
						element.remove();
					});
					return;
				}
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			},
			stop: function(event, ui) {
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			}
		});

		// клик на элемент
		element.click(function() {
			element.trigger("eventFamily", [widget, properties]);
		});
	},


	_setOption: function(key, value) {	
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		if (key === "x")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]); 
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "y")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "width")
		{
			var width = Math.round(value);
			var maxWidth = ScreenWidth - ((width > ScreenWidth) ? (properties.x * 2) : properties.x);
			width = (width <= maxWidth) ? width : maxWidth;
			properties[key] = (width < Char2Width) ? Char2Width : width;
			element.css("width", properties[key]);
			// обновим значения, чтобы текст умещался согласно параметрам
			this._setOption("caption", properties.caption);
			this._setOption("value", properties.value);
		}

		else if (key === "layer")
		{
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "caption")
		{
			var k_ = Math.round((properties.width - 40) / Char2Width) - 1; // максимальное кол-во символов в надписи
			properties[key] = (value.length > k_) ? value.substring(0, k_) : value;
			$(element).find("." + class_ + "-caption").text(properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "value")
		{
			value = ((value == "1") || (value == "true") || (value == "HIGH")) ? "true" : "false";
			properties[key] = value;
			// показать/скрыть флажок в зависимости от значения
			if (properties[key] == "true")
				$(element).find("." + class_ + "-value").show();
			else
				$(element).find("." + class_ + "-value").hide();
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "callback")
		{
			value = (!value) ? 0 : value;
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "KEYBOARD_KEY_CODE")
		{
			var keyCode = value;
			// меняем значение на противоположное
			if (keyCode == 32)
			{
				this._setOption("value", ((properties.value == "true") ? "false" : "true"));
			} 
		}
	},

	destroy: function() {
		this.options = null; // удаляем все свойства
	}
});

/* виджет UIButton */
$.widget("namespace.UIButton", {
	options: {
		x: 0,
		y: 0,
		width: 150,
		height: 32,
		layer: "default",
		caption: "Button",
		color: "", 
		callback: "0",
		rootVar: "0",
		value: "",
		icon: "ICON_0_24",
		signature: "int x, int y, int width, String layer, String caption, uint16_t* icon, pFuncStrP callback, String* rootVar",
		blank_: false
	},

	_create: function() {
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		// внешний вид
		// устанавливаем размеры
		element.css("width", properties.width);
		element.css("height", properties.height);

		// добавляем иконку, если требуется
		if ((properties.icon != "0") && (properties.icon != ""))
		{
			var icon = $("<div>", {class: (class_ + "-icon")}).appendTo(element);
			var src = "images/IconsLib/" + properties.icon + ".bmp";
			icon.css("backgroundImage", "url(\"" + src + "\")");
		}
		$("<div>", {class: (class_ + "-caption"), text: properties.caption}).appendTo(element); 

		this._setOption("caption", properties.caption);
		this._setOption("icon", properties.icon);

		// заготовке доп. свойства не нужны - выходим
		if (properties.blank_) 
			return; 

		// выставляем координаты
		element.css("top", properties.y);
		element.css("left", properties.x);

		// устанавливаем другие свойства
		element.data(properties); 

		// убираем лишние пробелы в signature
		properties.signature = (properties.signature).replace(new RegExp(", ","g"), ",");
		
		// делаем элемент подвиждным
		element.draggable({
			revert: "invalid", // чтоб копию за пределами экрана не кидали
			cursor: "move",
			drag: function(event, ui) {
				var X = Math.round(element.position().left);
				var Y = Math.round(element.position().top);
				properties.x = X;
				properties.y = Y;
				// если элемент брошен ниже чем высота дисплея + высота самого элемента
				if (Y > (element.parent().height() - element.height() / 2))
				{
					element.trigger("eventFamily", [null, null]);
					// прячем, затем удаляем элемент
					element.fadeOut(300, function() {
						element.remove();
					});
					return;
				}
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			},
			stop: function(event, ui) {
				element.trigger("eventFamily", [widget, properties]); // показать свойства
			}
		});

		// клик на элемент
		element.click(function() {
			element.trigger("eventFamily", [widget, properties]);
		});
	},


	_setOption: function(key, value) {	
		var widget = this;
		var element = this.element;
		var properties = this.options;
		var class_ = (element.attr("class")).split(" ")[0];

		if (key === "x")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]); 
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "y")
		{
			properties[key] = Math.round(value); // записываем в свойства
			element.css("left", properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "width")
		{
			var width = Math.round(value);
			var maxWidth = ScreenWidth - ((width > ScreenWidth) ? (properties.x * 2) : properties.x);
			var minWidth;
			if ((properties.icon != "0") && (properties.icon != ""))
			{
				var iconWidth = parseInt($(element).find("." + class_ + "-icon").css("width"));
				minWidth = 5 + iconWidth + 5 + Char2Width + 5;
			}
			else
			{
				minWidth = 5 + Char2Width + 5;
			}
			width = (width <= maxWidth) ? width : maxWidth;
			width = (width < minWidth) ? minWidth : width;
			properties[key] = width;
			element.css("width", properties[key]);
			// обновим значения, чтобы текст умещался согласно параметрам
			this._setOption("caption", properties.caption);
		}

		else if (key === "layer")
		{
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "caption")
		{
			var k_;
			if ((properties.icon != "0") && (properties.icon != ""))
			{
				var iconWidth = parseInt($(element).find("." + class_ + "-icon").css("width"));
				k_ = Math.round(((properties.width - 5 - iconWidth - 5 - 5)) / Char2Width) - 1;
			}
			else
			{
				k_ = Math.round(((properties.width - 5 - 5)) / Char2Width) - 1;
			}
			properties.caption = (value.length > k_) ? value.substring(0, k_) : value;
			var marginLeft;
			var textWidth = properties.caption.length * Char2Width;
			if ((properties.icon != "0") && (properties.icon != "")) // если иконка есть
			{
				var iconWidth = parseInt($(element).find("." + class_ + "-icon").css("width"));
				marginLeft = ((properties.width - textWidth - (iconWidth + 5)) / 2) + 1;
				$(element).find("." + class_ + "-icon").css("margin-left", marginLeft);
			}
			else
			{
				marginLeft = ((properties.width - textWidth) / 2) + 1;
				$(element).find("." + class_ + "-caption").css("margin-left", marginLeft);
			}
			$(element).find("." + class_ + "-caption").text(properties[key]);
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "callback")
		{
			value = (!value) ? 0 : value;
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "icon")
		{
			properties[key] = value;
			element.trigger("eventFamily", [widget, properties]); // показать свойства
		}

		else if (key === "KEYBOARD_KEY_CODE")
		{
			var keyCode = value;
			// меняем значение на противоположное
			if (keyCode == 32)
			{
				alert("space?");
			} 
		}
	},

	destroy: function() {
		this.options = null; // удаляем все свойства
	}
});