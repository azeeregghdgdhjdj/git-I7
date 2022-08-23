var string = "#myLogo*Jackselecta___presents___Particles ...___ ... Canvas___#thumbs-up*Cool no?___#heart*Please like this pen";
var string_sep = "___";
var imgSize = 350;
var p_size = 3;
var p_area = 4;
var fontsize = 140,
	font = "Poiret One";
var little_fontsize = 70,
	little_font = "Pacifico";
var color = "hsl(" + Math.floor(Math.random() * 360) + ", 80%, 50%)";//"#334";


// Construction du canvas.
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");
var H = window.innerHeight;
var W = window.innerWidth;
canvas.style.display = "block";
canvas.height = H;
canvas.width = W;


// Construction du canvas temporaire.
var tcanvas = document.createElement("canvas");
var tctx = tcanvas.getContext("2d");
tcanvas.height = H;
tcanvas.width = W;



// Construction des variables
var posx = 0;
var posy = 0;
var dec = (p_area - p_size) / 2;
var nbr_max = ( H / p_area ) * ( W / p_area );
char = string.split(string_sep);


// Construction des particules et de leur coordonnées
var particles = [];
var mapping = [];
for (var i = 0; i < nbr_max; i++) {
	particles.push(new particle(i));
	mapping.push(new pts(i));
};

function particle(i){
	this.size = p_size;
	this.x = W / 2;
	this.y = H / 2;
	this.a = 1;
   this.color = color;
}
function pts(i){
	this.x = posx;
	this.y = posy;
	this.pix = ((this.y+(p_area/2)) * W) - (W - (this.x+(p_area/2)));

	if((posx + p_area) < W){
		posx += p_area;
	}else{
		posx = 0;
		posy += p_area;
	}
}


// obtention des coordonnées
var coord = [];
var d = [];
var index = 0;
function getCoord(){
// vidage des données pour la création d'un nouveau tableau;
	d = [];
	coord = [];  
  
  
	// carrousel des valeurs du tableau "char"
	if(index < char.length){
		text = char[index];
		index++;
	}else{
		index = 0;
	}

// construction des données.
	tctx.fillStyle = "red";
	tctx.fillRect(0,0,W,H);

	// on contrôle si la valeur ne commence par un #
	if(text.substring(0,1) != "#"){ // si ce n'est pas le cas : c'est du texte
		tctx.fillStyle = "black";
		tctx.font = fontsize + "px " + font;
		tctx.textAlign = 'center';
		tctx.fillText(text, W/2, H/2);
	}else{ // si c'est le cas : c'est une image
		var info = text.substring(1,text.length).split('*'); // extraction de la phrase qui sera sous l'image;
		
		if((info.length) == 1){ // si cette variable ne contient pas de phrase
			
			var imgSrc = text.substring(1,text.length);
			img = document.getElementById(imgSrc);
			tctx.drawImage(img,(W - imgSize)/2,(H - imgSize)/2,imgSize,imgSize);
		
		}else{ // dans le cas contraire

			var imgSrc = text.substring(1,text.length);
			var label = info[1]; // extraction de la phrase (qui sera sous l'image)

			img = document.getElementById(info[0]);
			tctx.drawImage(img,(W - imgSize)/2,(H - imgSize)/2,imgSize,imgSize);

			tctx.fillStyle = "black";
			tctx.font = little_fontsize +  "px " + little_font;
			tctx.textAlign = 'center';
			tctx.fillText(label, W/2, H/2 + (imgSize/1.2));			
		
		}
	}
  
  // Calcul de la trajectoire de chaques points.
	data = tctx.getImageData(0,0,W,H).data;
	for (var i = 0; i < particles.length; i++) {
		pt = mapping[i];
		
		if(data[pt.pix*4] != 255){
			coord.push({x: pt.x, y: pt.y});
		}
	};
	for (var i = 0; i < particles.length; i++) {
		p = particles[i];
		p.a = 1;
		if(coord[i]){
			c = coord[i];
			d.push({dx: c.x - p.x,dy: c.y - p.y});// construction du tableau de destinations.
		}else{
			p.a = 0;
		}
	};
}


// rendu
function draw(){
	ctx.clearRect(0,0,W,H);
	for (var i = 0; i < particles.length; i++) {
		p = particles[i];
		if(d[i]){
			dec = d[i];
			ctx.fillStyle = p.color;
			ctx.fillRect(p.x,p.y,p.size,p.size);
			ctx.fill();
      
      // déplacement des particules pour arriver à leur destination
      // A chaque déplacment leur trajectoire diminue jusqu'a devenir nulle.
      var speed = 4; // valeur haute : vitesse lente, valeur basse vitesse rapide.
				p.x += (dec.dx /  speed);
				p.y += (dec.dy /  speed);
				dec.dx -= (dec.dx / speed);
				dec.dy -= (dec.dy / speed);
		}
	};
}

function init(){
	getCoord();
	setInterval(draw,30); // dessine en permanences les particules 
	setInterval(getCoord,3000); // cette action réactulaise toutes les 3sec les trajectoires de chaques points pour rendre la prochaine image.
}

init();