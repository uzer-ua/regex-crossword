var keyCodes = ['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','0','1','2','3','4','5','6','7','8','9','','','','','','','','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','','','','','','0','1','2','3','4','5','6','7','8','9'];
function prevDef(ev){
	ev = ev || window.event;
	if (ev){
	ev.cancelBubble = true;
		if (ev.preventDefault){
			ev.preventDefault();
		}
		if (ev.stopPropagation){
			ev.stopPropagation();
		}
	}
	return false;
}
function mClass(e,c,op){
	if (!e || !c) return;
	if (!e[0] || typeof e == "string") e = [e];
	if (!c[0] || typeof c == "string") c = [c];
	for (var i = 0; i < e.length; i++){
		var cls = e[i].className.split(' ');
		for (var j = 0; j < c.length; j++){
			if (cls.indexOf(c[j])>-1){
				if (op=='t' || op=='u')
					cls.splice(cls.indexOf(c[j]),1);
			}
			else{
				if (op=='t' || op=='s')
					cls.push(c[j]);
			}
		}
		e[i].className = cls.join(' ');
	}
}
function toggleClass(e,c){
	return mClass(e,c,'t');
}
function setClass(e,c){
	return mClass(e,c,'s');
}
function unsetClass(e,c){
	return mClass(e,c,'u');
}
var time = false;
var timer = false;
function pTimer(){
	if (!time) return;
	var t = Math.floor(((new Date().valueOf()) - time)/1000);
	if (time>3600){
		var h = Math.floor(t/3600);
		var m = t - h*3600;
		m = Math.floor(m/60);
		var s = t - h*3600 - m*60;
		s = ld(h)+':'+ld(m)+':'+ld(s);
	}
	else if (time>60){
		var m = t;
		m = Math.floor(m/60);
		var s = t - m*60;
		s = ld(m)+':'+ld(s);
	}
	else{
		var s = ld(t);
	}
	document.getElementById('timer').innerHTML = s;
}
function ld(s){
	s = s+'';
	if (s.length==1) s = '0'+s;
	return s;
}
var Cross = function(o){
	var that = this;
	var el = o.el || document.getElementsByTagName('body')[0] || false;
	var data = o.data || false;
	if (!data || !el) throw "Not all needed build options specified.";
	var field = new Array();
	var active = null;
	el.innerHTML = '';
	var size = Math.floor(data[0].length/2);
	
	//*******************BUILD GRID
	var buildCell = function(loc,last){
		last = last || false;
		var c = document.createElement('SPAN');
		c.className = 'hexcell'+(last?' last':'');
		c.innerHTML = '<span><span><span><span><span class="input"></span></span></span></span></span>';
		c.getElementsByClassName('input')[0].setAttribute('loc',loc);
		return c;
	};
	var buildTitle = function(d,r){
		var t = document.createElement('SPAN');
		t.className = 'title title'+d;
		t.id = 'title'+d+r;
		t.innerHTML = data[d][r];
		return t;
	};
	var k = 1;
	var l = size;
	var loc = [0,size*2,size];
	for (var i = 0; i <= size; i++){
		loc[1] = size*2;
		loc[2] = 0;
		if (k==1) loc[2] += (6-i);
		if (k==-1) loc[1] -= i;
		var d = document.createElement('DIV');
		d.style.display = "inline-block";
		//this row header
		d.appendChild(buildTitle(0,i+(k==-1?size:0)));
		for (var j = 0; j <= l; j++){
			if (i == 0 || j == l){//first row or last cell
				d.appendChild(buildTitle(k==1?1:2,loc[k==1?1:2]));
			}
			if (i == size && k==1 && j==l){//last cell in center row
				d.appendChild(buildTitle(2,12));
			}
			if (i == size && k==-1 && j != l){//last row
				d.appendChild(buildTitle(2,loc[2]));
			}
			var cell = buildCell(loc.join('_'),j==l);
			d.appendChild(cell);
			loc[1]--;
			loc[2]++;
		}
		el.appendChild(d);
		el.appendChild(document.createElement('BR'));
		if (i==size && k == 1) { i = 0; k = -1; }
		l += k;
		loc[0]++;
	};
	this.getLoc = function(el){
		var loc = el.getAttribute('loc').split('_');
		for (var i = 0; i < 3; i++) loc[i] = parseInt(loc[i]);
		return loc;
	}
	//**************POSITION
	this.get = function(loc){
		if (!loc) return false;
		return document.querySelector('[loc="' + loc.join('_') + '"]');
	};
	this.setActive = function(loc){
		if (!loc) return;
		var ael = el.getElementsByClassName('active')[0];
		if (ael) unsetClass(ael,'active');
		active = this.get(loc);
		if (active){
			active.className = 'input active';
			if (ael)
				this.highLightRows(this.getLoc(ael),'hidden');
			else
				setClass(el.getElementsByClassName('title'),'hidden');
			this.highLightRows(this.getLoc(active),'highlight');
			return true;
		}
		else{
			unsetClass(el.getElementsByClassName('title'),['hidden','highlight']);
		}
		return false;
	};
	this.highLightRows = function(loc,state){
		var sel = new Array();
		for (var i = 0; i < loc.length; i++){
			sel.push('#title'+i+loc[i]);
		}
		unsetClass(el.querySelectorAll(sel),(state=='hidden'?'highlight':'hidden'));
		setClass(el.querySelectorAll(sel),state);
	};
	this.navigate = function(dir){
		if (active){
			var loc = this.getLoc(active);
			switch (dir){
				case 'up':{
					if (loc[0]==0) return;
					loc[0]--;
					if(loc[2]==size*2) loc[1]++;
					else loc[2]++;
					if (!this.setActive(loc)){
						console.error('Something wrong with position calculation.');
						return false;
					}
					return true;
				}
				case 'left':{
					if (loc[1]==size*2 && loc[2]==0) return;
					if (loc[1]==size*2) loc[0]++;
					else loc[1]++;
					if (loc[2]==0) loc[0]--;
					else loc[2]--;
					if (!this.setActive(loc)){
						console.error('Something wrong with position calculation;');
						return false;
					}
					return true;
				}
				case 'down':{
					if (loc[0]==size*2) return;
					loc[0]++;
					if(loc[2]==0) loc[1]--;
					else loc[2]--;
					if (!this.setActive(loc)){
						console.error('Something wrong with position calculation;');
						return false;
					}
					return true;
				}
				case 'right':{
					if (loc[1]==0 && loc[2]==size*2) return;
					if (loc[1]==0) loc[0]--;
					else loc[1]--;
					if (loc[2]==size*2) loc[0]++;
					else loc[2]++;
					if (!this.setActive(loc)){
						console.error('Something wrong with position calculation;');
						return false;
					}
					return true;
				}
			}
		}
		else{
			this.setActive([0,size*2,size]);
		}
		return true;
	};
	
	//****************VALUES
	this.assign = function(c){
		if (!active) return;
		if (c!=active.innerHTML){
			active.innerHTML = c;
			if (!time && !timer){
				time = new Date().valueOf();
				timer = setInterval(function(){pTimer();},1000);
				pTimer();
			}
			var loc = this.getLoc(active);
			for (var i = 0; i < loc.length; i++){
				this.updateRow(i,loc[i]);
			}
		}
	};
	this.updateRow = function(d,r){
		var s = '';
		var l = size+(r>size?size*2-r:r);
		var loc = [0,0,0];
		loc[d] = r;
		d++; if (d == 3) d = 0;
		loc[d] = 12 - (r>size?r-size:0);
		d++; if (d == 3) d = 0;
		loc[d] += (r<size?size-r:0);
		d++; if (d == 3) d = 0;
		for (var i = 0; i <= l; i++){
			s += this.get(loc).innerHTML;
			d++; if (d == 3) d = 0;
			loc[d]--;
			d++; if (d == 3) d = 0;
			loc[d]++;
			d++; if (d == 3) d = 0;
			if (s.length == l+1){
				var e = new RegExp('^'+data[d][r]+'$');
				if (e.test(s)) this.correct(d,r,1);
				else this.correct(d,r,2);
			}
			else{
				this.correct(d,r,0);
			}
		}
		if (el.getElementsByClassName('title').length == el.getElementsByClassName('correct').length) clearInterval(timer);
	}
	this.correct = function(d,r,s){
		r = el.querySelector('#title'+d+r);
		switch(s){
			case 0:{
				unsetClass(r,['correct','wrong']);
			}break;
			case 1:{
				setClass(r,'correct');
			}break;
			case 2:{
				setClass(r,'wrong');
			}break;
		}
	}
	//****************LISTENERS
	this.click = function(e){
		var t = e.target || e.toElement || e.srcElement || false;
		if (!t) return;
		if (t.className!='input'){
			if (t.className!='input active') this.setActive([-1,-1,-1]);
			return;
		}
		this.setActive(this.getLoc(t));
	};
	this.kd = function(e){
		var d = false;
		if (e.keyCode==37) d = 'left';
		else if (e.keyCode==38) d = 'up';
		else if (e.keyCode==39) d = 'right';
		else if (e.keyCode==40) d = 'down';
		if (d){
			if (this.navigate(d)){
				prevDef(e);
				return false;
			}
			return;
		}
		if (!active) return;
		if (keyCodes[e.keyCode]) {this.assign(keyCodes[e.keyCode]);prevDef(e);}
		if (e.keyCode==8 || e.keyCode==46) {this.assign('');prevDef(e);};
		if (e.keyCode==27) {this.setActive([-1,-1,-1]);prevDef(e);};
	};
	document.addEventListener('click',function(e){that.click(e);},false);
	document.addEventListener('keydown',function(e){that.kd(e);},false);
}
var cross;
function init(){
	var data = [
		[
			'.*H.*H.*',
			'(DI|NS|TH|OM)*',
			'F.*[AO].*[AO].*',
			'(O|RHH|MM)*',
			'.*',
			'C*MC(CCC|MM)*',
			'[^C]*[^R]*III.*',
			'(...?)\\1*',
			'([^X]|XCC)*',
			'(RR|HHH)*.?',
			'N.*X.X.X.*E',
			'R*D*M*',
			'.(C|HH)*',
		],
		[
			'.*SE.*UE.*',
			'.*LR.*RL.*',
			'.*OXR.*',
			'([^EMC]|EM)*',
			'(HHX|[^HX])*',
			'.*PRR.*DDC.*',
			'.*',
			'[AM]*CM(RC)*R?',
			'([^MC]|MM|CC)*',
			'(E|CR|MN)*',
			'P+(..)\\1.*',
			'[CHMNOR]*I[CHMNOR]*',
			'(ND|ET|IN)[^X]*',
		],
		[
			'.*G.*V.*H.*',
			'[CR]*',
			'.*XEXM*',
			'.*DD.*CCM.*',
			'.*XHCR.*X.*',
			'.*(.)(.)(.)(.)\\4\\3\\2\\1.*',
			'.*(IN|SE|HI)',
			'[^C]*MMM[^C]*',
			'.*(.)C\\1X\\1.*',
			'[CEIMU]*OH[AEMOR]*',
			'(RX|[^R])*',
			'[^M]*M[^M]*',
			'(S|MM|HHH)*'
		],
	];
	cross = new Cross({el:document.getElementById('map'),data:data});
}