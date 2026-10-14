(()=>{var _c="170";var vd=0,Nl=1,xd=2;var sh=1,Tc=2,Rn=3,Mn=0,Zt=1,Bt=2,ai=0,cs=1,Ol=2,Bl=3,Ul=4,wd=5,Ei=100,yd=101,_d=102,Td=103,Id=104,Pd=200,bd=201,Ed=202,Cd=203,tA=204,nA=205,Sd=206,Dd=207,Ld=208,Rd=209,zd=210,Nd=211,Od=212,Bd=213,Ud=214,iA=0,sA=1,rA=2,ds=3,oA=4,aA=5,AA=6,cA=7,rh=0,Zd=1,Fd=2,Ai=0,kd=1,Vd=2,Hd=3,Ic=4,jd=5,Xd=6,Gd=7,Zl="attached",Yd="detached",oh=300,fs=301,ps=302,lA=303,uA=304,Jo=306,Di=1e3,Nn=1001,nr=1002,St=1003,Pc=1004;var ss=1005;var Ut=1006,Qs=1007;var gn=1008;var Un=1009,ah=1010,Ah=1011,ir=1012,bc=1013,Li=1014,dn=1015,wr=1016,Ec=1017,Cc=1018,ms=1020,ch=35902,lh=1021,uh=1022,Jt=1023,hh=1024,dh=1025,ls=1026,gs=1027,Sc=1028,Dc=1029,fh=1030,Lc=1031;var Rc=1033,Ao=33776,co=33777,lo=33778,uo=33779,hA=35840,dA=35841,fA=35842,pA=35843,mA=36196,gA=37492,MA=37496,vA=37808,xA=37809,wA=37810,yA=37811,_A=37812,TA=37813,IA=37814,PA=37815,bA=37816,EA=37817,CA=37818,SA=37819,DA=37820,LA=37821,ho=36492,RA=36494,zA=36495,ph=36283,NA=36284,OA=36285,BA=36286,zc=2200,Nc=2201,Wd=2202,Ms=2300,vs=2301,xa=2302,rs=2400,os=2401,fo=2402,Oc=2500,Qd=2501,mh=0,qo=1,yr=2,Jd=3200,qd=3201;var gh=0,Kd=1,ri="",gt="srgb",Dt="srgb-linear",Ko="linear",rt="srgb";var Hi=7680;var Fl=519,$d=512,ef=513,tf=514,Mh=515,nf=516,sf=517,rf=518,of=519,UA=35044;var kl="300 es",On=2e3,po=2001,Zn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let i=this._listeners[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}},Et=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Vl=1234567,Js=Math.PI/180,xs=180/Math.PI;function qt(){let s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Et[s&255]+Et[s>>8&255]+Et[s>>16&255]+Et[s>>24&255]+"-"+Et[e&255]+Et[e>>8&255]+"-"+Et[e>>16&15|64]+Et[e>>24&255]+"-"+Et[t&63|128]+Et[t>>8&255]+"-"+Et[t>>16&255]+Et[t>>24&255]+Et[n&255]+Et[n>>8&255]+Et[n>>16&255]+Et[n>>24&255]).toLowerCase()}function _t(s,e,t){return Math.max(e,Math.min(t,s))}function Bc(s,e){return(s%e+e)%e}function af(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Af(s,e,t){return s!==e?(t-s)/(e-s):0}function qs(s,e,t){return(1-t)*s+t*e}function cf(s,e,t,n){return qs(s,e,1-Math.exp(-t*n))}function lf(s,e=1){return e-Math.abs(Bc(s,e*2)-e)}function uf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function hf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function df(s,e){return s+Math.floor(Math.random()*(e-s+1))}function ff(s,e){return s+Math.random()*(e-s)}function pf(s){return s*(.5-Math.random())}function mf(s){s!==void 0&&(Vl=s);let e=Vl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function gf(s){return s*Js}function Mf(s){return s*xs}function vf(s){return(s&s-1)===0&&s!==0}function xf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function wf(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function yf(s,e,t,n,i){let r=Math.cos,o=Math.sin,a=r(t/2),A=o(t/2),c=r((e+n)/2),l=o((e+n)/2),u=r((e-n)/2),h=o((e-n)/2),d=r((n-e)/2),p=o((n-e)/2);switch(i){case"XYX":s.set(a*l,A*u,A*h,a*c);break;case"YZY":s.set(A*h,a*l,A*u,a*c);break;case"ZXZ":s.set(A*u,A*h,a*l,a*c);break;case"XZX":s.set(a*l,A*p,A*d,a*c);break;case"YXY":s.set(A*d,a*l,A*p,a*c);break;case"ZYZ":s.set(A*p,A*d,a*l,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function hn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function it(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var vh={DEG2RAD:Js,RAD2DEG:xs,generateUUID:qt,clamp:_t,euclideanModulo:Bc,mapLinear:af,inverseLerp:Af,lerp:qs,damp:cf,pingpong:lf,smoothstep:uf,smootherstep:hf,randInt:df,randFloat:ff,randFloatSpread:pf,seededRandom:mf,degToRad:gf,radToDeg:Mf,isPowerOfTwo:vf,ceilPowerOfTwo:xf,floorPowerOfTwo:wf,setQuaternionFromProperEuler:yf,normalize:it,denormalize:hn},re=class s{constructor(e=0,t=0){s.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(_t(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Fe=class s{constructor(e,t,n,i,r,o,a,A,c){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,A,c)}set(e,t,n,i,r,o,a,A,c){let l=this.elements;return l[0]=e,l[1]=i,l[2]=a,l[3]=t,l[4]=r,l[5]=A,l[6]=n,l[7]=o,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],A=n[6],c=n[1],l=n[4],u=n[7],h=n[2],d=n[5],p=n[8],g=i[0],m=i[3],f=i[6],T=i[1],y=i[4],M=i[7],R=i[2],E=i[5],C=i[8];return r[0]=o*g+a*T+A*R,r[3]=o*m+a*y+A*E,r[6]=o*f+a*M+A*C,r[1]=c*g+l*T+u*R,r[4]=c*m+l*y+u*E,r[7]=c*f+l*M+u*C,r[2]=h*g+d*T+p*R,r[5]=h*m+d*y+p*E,r[8]=h*f+d*M+p*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],A=e[6],c=e[7],l=e[8];return t*o*l-t*a*c-n*r*l+n*a*A+i*r*c-i*o*A}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],A=e[6],c=e[7],l=e[8],u=l*o-a*c,h=a*A-l*r,d=c*r-o*A,p=t*u+n*h+i*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let g=1/p;return e[0]=u*g,e[1]=(i*c-l*n)*g,e[2]=(a*n-i*o)*g,e[3]=h*g,e[4]=(l*t-i*A)*g,e[5]=(i*r-a*t)*g,e[6]=d*g,e[7]=(n*A-c*t)*g,e[8]=(o*t-n*r)*g,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){let A=Math.cos(r),c=Math.sin(r);return this.set(n*A,n*c,-n*(A*o+c*a)+o+e,-i*c,i*A,-i*(-c*o+A*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(wa.makeScale(e,t)),this}rotate(e){return this.premultiply(wa.makeRotation(-e)),this}translate(e,t){return this.premultiply(wa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},wa=new Fe;function xh(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function sr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function _f(){let s=sr("canvas");return s.style.display="block",s}var Hl={};function Ys(s){s in Hl||(Hl[s]=!0,console.warn(s))}function Tf(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function If(s){let e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Pf(s){let e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var Xe={enabled:!0,workingColorSpace:Dt,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===rt&&(s.r=Bn(s.r),s.g=Bn(s.g),s.b=Bn(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===rt&&(s.r=us(s.r),s.g=us(s.g),s.b=us(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ri?Ko:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function Bn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function us(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var jl=[.64,.33,.3,.6,.15,.06],Xl=[.2126,.7152,.0722],Gl=[.3127,.329],Yl=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Wl=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Xe.define({[Dt]:{primaries:jl,whitePoint:Gl,transfer:Ko,toXYZ:Yl,fromXYZ:Wl,luminanceCoefficients:Xl,workingColorSpaceConfig:{unpackColorSpace:gt},outputColorSpaceConfig:{drawingBufferColorSpace:gt}},[gt]:{primaries:jl,whitePoint:Gl,transfer:rt,toXYZ:Yl,fromXYZ:Wl,luminanceCoefficients:Xl,outputColorSpaceConfig:{drawingBufferColorSpace:gt}}});var ji,ZA=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ji===void 0&&(ji=sr("canvas")),ji.width=e.width,ji.height=e.height;let n=ji.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ji}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=sr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Bn(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Bn(t[n]/255)*255):t[n]=Bn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},bf=0,mo=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:bf++}),this.uuid=qt(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(ya(i[o].image)):r.push(ya(i[o]))}else r=ya(i);n.url=r}return t||(e.images[this.uuid]=n),n}};function ya(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?ZA.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Ef=0,It=class s extends Zn{constructor(e=s.DEFAULT_IMAGE,t=s.DEFAULT_MAPPING,n=Nn,i=Nn,r=Ut,o=gn,a=Jt,A=Un,c=s.DEFAULT_ANISOTROPY,l=ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=qt(),this.name="",this.source=new mo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=A,this.offset=new re(0,0),this.repeat=new re(1,1),this.center=new re(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==oh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Di:e.x=e.x-Math.floor(e.x);break;case Nn:e.x=e.x<0?0:1;break;case nr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Di:e.y=e.y-Math.floor(e.y);break;case Nn:e.y=e.y<0?0:1;break;case nr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};It.DEFAULT_IMAGE=null;It.DEFAULT_MAPPING=oh;It.DEFAULT_ANISOTROPY=1;var Ke=class s{constructor(e=0,t=0,n=0,i=1){s.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r,A=e.elements,c=A[0],l=A[4],u=A[8],h=A[1],d=A[5],p=A[9],g=A[2],m=A[6],f=A[10];if(Math.abs(l-h)<.01&&Math.abs(u-g)<.01&&Math.abs(p-m)<.01){if(Math.abs(l+h)<.1&&Math.abs(u+g)<.1&&Math.abs(p+m)<.1&&Math.abs(c+d+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(c+1)/2,M=(d+1)/2,R=(f+1)/2,E=(l+h)/4,C=(u+g)/4,D=(p+m)/4;return y>M&&y>R?y<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(y),i=E/n,r=C/n):M>R?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=E/i,r=D/i):R<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(R),n=C/r,i=D/r),this.set(n,i,r,t),this}let T=Math.sqrt((m-p)*(m-p)+(u-g)*(u-g)+(h-l)*(h-l));return Math.abs(T)<.001&&(T=1),this.x=(m-p)/T,this.y=(u-g)/T,this.z=(h-l)/T,this.w=Math.acos((c+d+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},FA=class extends Zn{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Ke(0,0,e,t),this.scissorTest=!1,this.viewport=new Ke(0,0,e,t);let i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new It(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new mo(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fn=class extends FA{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},go=class extends It{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=St,this.minFilter=St,this.wrapR=Nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var kA=class extends It{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=St,this.minFilter=St,this.wrapR=Nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ft=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let A=n[i+0],c=n[i+1],l=n[i+2],u=n[i+3],h=r[o+0],d=r[o+1],p=r[o+2],g=r[o+3];if(a===0){e[t+0]=A,e[t+1]=c,e[t+2]=l,e[t+3]=u;return}if(a===1){e[t+0]=h,e[t+1]=d,e[t+2]=p,e[t+3]=g;return}if(u!==g||A!==h||c!==d||l!==p){let m=1-a,f=A*h+c*d+l*p+u*g,T=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){let R=Math.sqrt(y),E=Math.atan2(R,f*T);m=Math.sin(m*E)/R,a=Math.sin(a*E)/R}let M=a*T;if(A=A*m+h*M,c=c*m+d*M,l=l*m+p*M,u=u*m+g*M,m===1-a){let R=1/Math.sqrt(A*A+c*c+l*l+u*u);A*=R,c*=R,l*=R,u*=R}}e[t]=A,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){let a=n[i],A=n[i+1],c=n[i+2],l=n[i+3],u=r[o],h=r[o+1],d=r[o+2],p=r[o+3];return e[t]=a*p+l*u+A*d-c*h,e[t+1]=A*p+l*h+c*u-a*d,e[t+2]=c*p+l*d+a*h-A*u,e[t+3]=l*p-a*u-A*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,A=Math.sin,c=a(n/2),l=a(i/2),u=a(r/2),h=A(n/2),d=A(i/2),p=A(r/2);switch(o){case"XYZ":this._x=h*l*u+c*d*p,this._y=c*d*u-h*l*p,this._z=c*l*p+h*d*u,this._w=c*l*u-h*d*p;break;case"YXZ":this._x=h*l*u+c*d*p,this._y=c*d*u-h*l*p,this._z=c*l*p-h*d*u,this._w=c*l*u+h*d*p;break;case"ZXY":this._x=h*l*u-c*d*p,this._y=c*d*u+h*l*p,this._z=c*l*p+h*d*u,this._w=c*l*u-h*d*p;break;case"ZYX":this._x=h*l*u-c*d*p,this._y=c*d*u+h*l*p,this._z=c*l*p-h*d*u,this._w=c*l*u+h*d*p;break;case"YZX":this._x=h*l*u+c*d*p,this._y=c*d*u+h*l*p,this._z=c*l*p-h*d*u,this._w=c*l*u-h*d*p;break;case"XZY":this._x=h*l*u-c*d*p,this._y=c*d*u-h*l*p,this._z=c*l*p+h*d*u,this._w=c*l*u+h*d*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],A=t[9],c=t[2],l=t[6],u=t[10],h=n+a+u;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(l-A)*d,this._y=(r-c)*d,this._z=(o-i)*d}else if(n>a&&n>u){let d=2*Math.sqrt(1+n-a-u);this._w=(l-A)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(r+c)/d}else if(a>u){let d=2*Math.sqrt(1+a-n-u);this._w=(r-c)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(A+l)/d}else{let d=2*Math.sqrt(1+u-n-a);this._w=(o-i)/d,this._x=(r+c)/d,this._y=(A+l)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(_t(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,A=t._y,c=t._z,l=t._w;return this._x=n*l+o*a+i*c-r*A,this._y=i*l+o*A+r*a-n*c,this._z=r*l+o*c+n*A-i*a,this._w=o*l-n*a-i*A-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let A=1-a*a;if(A<=Number.EPSILON){let d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*i+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}let c=Math.sqrt(A),l=Math.atan2(c,a),u=Math.sin((1-t)*l)/c,h=Math.sin(t*l)/c;return this._w=o*u+this._w*h,this._x=n*u+this._x*h,this._y=i*u+this._y*h,this._z=r*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},b=class s{constructor(e=0,t=0,n=0){s.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ql.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ql.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,A=e.w,c=2*(o*i-a*n),l=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+A*c+o*u-a*l,this.y=n+A*l+a*c-r*u,this.z=i+A*u+r*l-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,A=t.z;return this.x=i*A-r*a,this.y=r*o-n*A,this.z=n*a-i*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return _a.copy(this).projectOnVector(e),this.sub(_a)}reflect(e){return this.sub(_a.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(_t(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},_a=new b,Ql=new Ft,Kt=class{constructor(e=new b(1/0,1/0,1/0),t=new b(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(cn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(cn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=cn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,cn):cn.fromBufferAttribute(r,o),cn.applyMatrix4(e.matrixWorld),this.expandByPoint(cn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Lr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Lr.copy(n.boundingBox)),Lr.applyMatrix4(e.matrixWorld),this.union(Lr)}let i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,cn),cn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Zs),Rr.subVectors(this.max,Zs),Xi.subVectors(e.a,Zs),Gi.subVectors(e.b,Zs),Yi.subVectors(e.c,Zs),$n.subVectors(Gi,Xi),ei.subVectors(Yi,Gi),wi.subVectors(Xi,Yi);let t=[0,-$n.z,$n.y,0,-ei.z,ei.y,0,-wi.z,wi.y,$n.z,0,-$n.x,ei.z,0,-ei.x,wi.z,0,-wi.x,-$n.y,$n.x,0,-ei.y,ei.x,0,-wi.y,wi.x,0];return!Ta(t,Xi,Gi,Yi,Rr)||(t=[1,0,0,0,1,0,0,0,1],!Ta(t,Xi,Gi,Yi,Rr))?!1:(zr.crossVectors($n,ei),t=[zr.x,zr.y,zr.z],Ta(t,Xi,Gi,Yi,Rr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,cn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(cn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},bn=[new b,new b,new b,new b,new b,new b,new b,new b],cn=new b,Lr=new Kt,Xi=new b,Gi=new b,Yi=new b,$n=new b,ei=new b,wi=new b,Zs=new b,Rr=new b,zr=new b,yi=new b;function Ta(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){yi.fromArray(s,r);let a=i.x*Math.abs(yi.x)+i.y*Math.abs(yi.y)+i.z*Math.abs(yi.z),A=e.dot(yi),c=t.dot(yi),l=n.dot(yi);if(Math.max(-Math.max(A,c,l),Math.min(A,c,l))>a)return!1}return!0}var Cf=new Kt,Fs=new b,Ia=new b,jt=class{constructor(e=new b,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Cf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Fs.subVectors(e,this.center);let t=Fs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Fs,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ia.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Fs.copy(e.center).add(Ia)),this.expandByPoint(Fs.copy(e.center).sub(Ia))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},En=new b,Pa=new b,Nr=new b,ti=new b,ba=new b,Or=new b,Ea=new b,Ri=class{constructor(e=new b,t=new b(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,En)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=En.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(En.copy(this.origin).addScaledVector(this.direction,t),En.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Pa.copy(e).add(t).multiplyScalar(.5),Nr.copy(t).sub(e).normalize(),ti.copy(this.origin).sub(Pa);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Nr),a=ti.dot(this.direction),A=-ti.dot(Nr),c=ti.lengthSq(),l=Math.abs(1-o*o),u,h,d,p;if(l>0)if(u=o*A-a,h=o*a-A,p=r*l,u>=0)if(h>=-p)if(h<=p){let g=1/l;u*=g,h*=g,d=u*(u+o*h+2*a)+h*(o*u+h+2*A)+c}else h=r,u=Math.max(0,-(o*h+a)),d=-u*u+h*(h+2*A)+c;else h=-r,u=Math.max(0,-(o*h+a)),d=-u*u+h*(h+2*A)+c;else h<=-p?(u=Math.max(0,-(-o*r+a)),h=u>0?-r:Math.min(Math.max(-r,-A),r),d=-u*u+h*(h+2*A)+c):h<=p?(u=0,h=Math.min(Math.max(-r,-A),r),d=h*(h+2*A)+c):(u=Math.max(0,-(o*r+a)),h=u>0?r:Math.min(Math.max(-r,-A),r),d=-u*u+h*(h+2*A)+c);else h=o>0?-r:r,u=Math.max(0,-(o*h+a)),d=-u*u+h*(h+2*A)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Pa).addScaledVector(Nr,h),d}intersectSphere(e,t){En.subVectors(e.center,this.origin);let n=En.dot(this.direction),i=En.dot(En)-n*n,r=e.radius*e.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,A=n+o;return A<0?null:a<0?this.at(A,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,A,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,i=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,i=(e.min.x-h.x)*c),l>=0?(r=(e.min.y-h.y)*l,o=(e.max.y-h.y)*l):(r=(e.max.y-h.y)*l,o=(e.min.y-h.y)*l),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-h.z)*u,A=(e.max.z-h.z)*u):(a=(e.max.z-h.z)*u,A=(e.min.z-h.z)*u),n>A||a>i)||((a>n||n!==n)&&(n=a),(A<i||i!==i)&&(i=A),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,En)!==null}intersectTriangle(e,t,n,i,r){ba.subVectors(t,e),Or.subVectors(n,e),Ea.crossVectors(ba,Or);let o=this.direction.dot(Ea),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ti.subVectors(this.origin,e);let A=a*this.direction.dot(Or.crossVectors(ti,Or));if(A<0)return null;let c=a*this.direction.dot(ba.cross(ti));if(c<0||A+c>o)return null;let l=-a*ti.dot(Ea);return l<0?null:this.at(l/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Re=class s{constructor(e,t,n,i,r,o,a,A,c,l,u,h,d,p,g,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,A,c,l,u,h,d,p,g,m)}set(e,t,n,i,r,o,a,A,c,l,u,h,d,p,g,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=i,f[1]=r,f[5]=o,f[9]=a,f[13]=A,f[2]=c,f[6]=l,f[10]=u,f[14]=h,f[3]=d,f[7]=p,f[11]=g,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/Wi.setFromMatrixColumn(e,0).length(),r=1/Wi.setFromMatrixColumn(e,1).length(),o=1/Wi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),A=Math.cos(i),c=Math.sin(i),l=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let h=o*l,d=o*u,p=a*l,g=a*u;t[0]=A*l,t[4]=-A*u,t[8]=c,t[1]=d+p*c,t[5]=h-g*c,t[9]=-a*A,t[2]=g-h*c,t[6]=p+d*c,t[10]=o*A}else if(e.order==="YXZ"){let h=A*l,d=A*u,p=c*l,g=c*u;t[0]=h+g*a,t[4]=p*a-d,t[8]=o*c,t[1]=o*u,t[5]=o*l,t[9]=-a,t[2]=d*a-p,t[6]=g+h*a,t[10]=o*A}else if(e.order==="ZXY"){let h=A*l,d=A*u,p=c*l,g=c*u;t[0]=h-g*a,t[4]=-o*u,t[8]=p+d*a,t[1]=d+p*a,t[5]=o*l,t[9]=g-h*a,t[2]=-o*c,t[6]=a,t[10]=o*A}else if(e.order==="ZYX"){let h=o*l,d=o*u,p=a*l,g=a*u;t[0]=A*l,t[4]=p*c-d,t[8]=h*c+g,t[1]=A*u,t[5]=g*c+h,t[9]=d*c-p,t[2]=-c,t[6]=a*A,t[10]=o*A}else if(e.order==="YZX"){let h=o*A,d=o*c,p=a*A,g=a*c;t[0]=A*l,t[4]=g-h*u,t[8]=p*u+d,t[1]=u,t[5]=o*l,t[9]=-a*l,t[2]=-c*l,t[6]=d*u+p,t[10]=h-g*u}else if(e.order==="XZY"){let h=o*A,d=o*c,p=a*A,g=a*c;t[0]=A*l,t[4]=-u,t[8]=c*l,t[1]=h*u+g,t[5]=o*l,t[9]=d*u-p,t[2]=p*u-d,t[6]=a*l,t[10]=g*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Sf,e,Df)}lookAt(e,t,n){let i=this.elements;return Vt.subVectors(e,t),Vt.lengthSq()===0&&(Vt.z=1),Vt.normalize(),ni.crossVectors(n,Vt),ni.lengthSq()===0&&(Math.abs(n.z)===1?Vt.x+=1e-4:Vt.z+=1e-4,Vt.normalize(),ni.crossVectors(n,Vt)),ni.normalize(),Br.crossVectors(Vt,ni),i[0]=ni.x,i[4]=Br.x,i[8]=Vt.x,i[1]=ni.y,i[5]=Br.y,i[9]=Vt.y,i[2]=ni.z,i[6]=Br.z,i[10]=Vt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],A=n[8],c=n[12],l=n[1],u=n[5],h=n[9],d=n[13],p=n[2],g=n[6],m=n[10],f=n[14],T=n[3],y=n[7],M=n[11],R=n[15],E=i[0],C=i[4],D=i[8],_=i[12],x=i[1],S=i[5],V=i[9],B=i[13],F=i[2],W=i[6],k=i[10],ee=i[14],H=i[3],ae=i[7],fe=i[11],xe=i[15];return r[0]=o*E+a*x+A*F+c*H,r[4]=o*C+a*S+A*W+c*ae,r[8]=o*D+a*V+A*k+c*fe,r[12]=o*_+a*B+A*ee+c*xe,r[1]=l*E+u*x+h*F+d*H,r[5]=l*C+u*S+h*W+d*ae,r[9]=l*D+u*V+h*k+d*fe,r[13]=l*_+u*B+h*ee+d*xe,r[2]=p*E+g*x+m*F+f*H,r[6]=p*C+g*S+m*W+f*ae,r[10]=p*D+g*V+m*k+f*fe,r[14]=p*_+g*B+m*ee+f*xe,r[3]=T*E+y*x+M*F+R*H,r[7]=T*C+y*S+M*W+R*ae,r[11]=T*D+y*V+M*k+R*fe,r[15]=T*_+y*B+M*ee+R*xe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],A=e[9],c=e[13],l=e[2],u=e[6],h=e[10],d=e[14],p=e[3],g=e[7],m=e[11],f=e[15];return p*(+r*A*u-i*c*u-r*a*h+n*c*h+i*a*d-n*A*d)+g*(+t*A*d-t*c*h+r*o*h-i*o*d+i*c*l-r*A*l)+m*(+t*c*u-t*a*d-r*o*u+n*o*d+r*a*l-n*c*l)+f*(-i*a*l-t*A*u+t*a*h+i*o*u-n*o*h+n*A*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],A=e[6],c=e[7],l=e[8],u=e[9],h=e[10],d=e[11],p=e[12],g=e[13],m=e[14],f=e[15],T=u*m*c-g*h*c+g*A*d-a*m*d-u*A*f+a*h*f,y=p*h*c-l*m*c-p*A*d+o*m*d+l*A*f-o*h*f,M=l*g*c-p*u*c+p*a*d-o*g*d-l*a*f+o*u*f,R=p*u*A-l*g*A-p*a*h+o*g*h+l*a*m-o*u*m,E=t*T+n*y+i*M+r*R;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/E;return e[0]=T*C,e[1]=(g*h*r-u*m*r-g*i*d+n*m*d+u*i*f-n*h*f)*C,e[2]=(a*m*r-g*A*r+g*i*c-n*m*c-a*i*f+n*A*f)*C,e[3]=(u*A*r-a*h*r-u*i*c+n*h*c+a*i*d-n*A*d)*C,e[4]=y*C,e[5]=(l*m*r-p*h*r+p*i*d-t*m*d-l*i*f+t*h*f)*C,e[6]=(p*A*r-o*m*r-p*i*c+t*m*c+o*i*f-t*A*f)*C,e[7]=(o*h*r-l*A*r+l*i*c-t*h*c-o*i*d+t*A*d)*C,e[8]=M*C,e[9]=(p*u*r-l*g*r-p*n*d+t*g*d+l*n*f-t*u*f)*C,e[10]=(o*g*r-p*a*r+p*n*c-t*g*c-o*n*f+t*a*f)*C,e[11]=(l*a*r-o*u*r-l*n*c+t*u*c+o*n*d-t*a*d)*C,e[12]=R*C,e[13]=(l*g*i-p*u*i+p*n*h-t*g*h-l*n*m+t*u*m)*C,e[14]=(p*a*i-o*g*i-p*n*A+t*g*A+o*n*m-t*a*m)*C,e[15]=(o*u*i-l*a*i+l*n*A-t*u*A-o*n*h+t*a*h)*C,this}scale(e){let t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,A=e.z,c=r*o,l=r*a;return this.set(c*o+n,c*a-i*A,c*A+i*a,0,c*a+i*A,l*a+n,l*A-i*o,0,c*A-i*a,l*A+i*o,r*A*A+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,r=t._x,o=t._y,a=t._z,A=t._w,c=r+r,l=o+o,u=a+a,h=r*c,d=r*l,p=r*u,g=o*l,m=o*u,f=a*u,T=A*c,y=A*l,M=A*u,R=n.x,E=n.y,C=n.z;return i[0]=(1-(g+f))*R,i[1]=(d+M)*R,i[2]=(p-y)*R,i[3]=0,i[4]=(d-M)*E,i[5]=(1-(h+f))*E,i[6]=(m+T)*E,i[7]=0,i[8]=(p+y)*C,i[9]=(m-T)*C,i[10]=(1-(h+g))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,r=Wi.set(i[0],i[1],i[2]).length(),o=Wi.set(i[4],i[5],i[6]).length(),a=Wi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],ln.copy(this);let c=1/r,l=1/o,u=1/a;return ln.elements[0]*=c,ln.elements[1]*=c,ln.elements[2]*=c,ln.elements[4]*=l,ln.elements[5]*=l,ln.elements[6]*=l,ln.elements[8]*=u,ln.elements[9]*=u,ln.elements[10]*=u,t.setFromRotationMatrix(ln),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,r,o,a=On){let A=this.elements,c=2*r/(t-e),l=2*r/(n-i),u=(t+e)/(t-e),h=(n+i)/(n-i),d,p;if(a===On)d=-(o+r)/(o-r),p=-2*o*r/(o-r);else if(a===po)d=-o/(o-r),p=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return A[0]=c,A[4]=0,A[8]=u,A[12]=0,A[1]=0,A[5]=l,A[9]=h,A[13]=0,A[2]=0,A[6]=0,A[10]=d,A[14]=p,A[3]=0,A[7]=0,A[11]=-1,A[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=On){let A=this.elements,c=1/(t-e),l=1/(n-i),u=1/(o-r),h=(t+e)*c,d=(n+i)*l,p,g;if(a===On)p=(o+r)*u,g=-2*u;else if(a===po)p=r*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return A[0]=2*c,A[4]=0,A[8]=0,A[12]=-h,A[1]=0,A[5]=2*l,A[9]=0,A[13]=-d,A[2]=0,A[6]=0,A[10]=g,A[14]=-p,A[3]=0,A[7]=0,A[11]=0,A[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Wi=new b,ln=new Re,Sf=new b(0,0,0),Df=new b(1,1,1),ni=new b,Br=new b,Vt=new b,Jl=new Re,ql=new Ft,vn=class s{constructor(e=0,t=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,r=i[0],o=i[4],a=i[8],A=i[1],c=i[5],l=i[9],u=i[2],h=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(_t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-_t(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(A,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(_t(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(A,r));break;case"ZYX":this._y=Math.asin(-_t(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(A,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(_t(A,-1,1)),Math.abs(A)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-_t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-l,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Jl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Jl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ql.setFromEuler(this),this.setFromQuaternion(ql,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};vn.DEFAULT_ORDER="XYZ";var rr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Lf=0,Kl=new b,Qi=new Ft,Cn=new Re,Ur=new b,ks=new b,Rf=new b,zf=new Ft,$l=new b(1,0,0),eu=new b(0,1,0),tu=new b(0,0,1),nu={type:"added"},Nf={type:"removed"},Ji={type:"childadded",child:null},Ca={type:"childremoved",child:null},dt=class s extends Zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=qt(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let e=new b,t=new vn,n=new Ft,i=new b(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Re},normalMatrix:{value:new Fe}}),this.matrix=new Re,this.matrixWorld=new Re,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Qi.setFromAxisAngle(e,t),this.quaternion.multiply(Qi),this}rotateOnWorldAxis(e,t){return Qi.setFromAxisAngle(e,t),this.quaternion.premultiply(Qi),this}rotateX(e){return this.rotateOnAxis($l,e)}rotateY(e){return this.rotateOnAxis(eu,e)}rotateZ(e){return this.rotateOnAxis(tu,e)}translateOnAxis(e,t){return Kl.copy(e).applyQuaternion(this.quaternion),this.position.add(Kl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis($l,e)}translateY(e){return this.translateOnAxis(eu,e)}translateZ(e){return this.translateOnAxis(tu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ur.copy(e):Ur.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(ks,Ur,this.up):Cn.lookAt(Ur,ks,this.up),this.quaternion.setFromRotationMatrix(Cn),i&&(Cn.extractRotation(i.matrixWorld),Qi.setFromRotationMatrix(Cn),this.quaternion.premultiply(Qi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(nu),Ji.child=e,this.dispatchEvent(Ji),Ji.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Nf),Ca.child=e,this.dispatchEvent(Ca),Ca.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Cn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Cn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(nu),Ji.child=e,this.dispatchEvent(Ji),Ji.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,e,Rf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ks,zf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,A){return a[A.uuid]===void 0&&(a[A.uuid]=A.toJSON(e)),A.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let A=a.shapes;if(Array.isArray(A))for(let c=0,l=A.length;c<l;c++){let u=A[c];r(e.shapes,u)}else r(e.shapes,A)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let A=0,c=this.material.length;A<c;A++)a.push(r(e.materials,this.material[A]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let A=this.animations[a];i.animations.push(r(e.animations,A))}}if(t){let a=o(e.geometries),A=o(e.materials),c=o(e.textures),l=o(e.images),u=o(e.shapes),h=o(e.skeletons),d=o(e.animations),p=o(e.nodes);a.length>0&&(n.geometries=a),A.length>0&&(n.materials=A),c.length>0&&(n.textures=c),l.length>0&&(n.images=l),u.length>0&&(n.shapes=u),h.length>0&&(n.skeletons=h),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){let A=[];for(let c in a){let l=a[c];delete l.metadata,A.push(l)}return A}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}};dt.DEFAULT_UP=new b(0,1,0);dt.DEFAULT_MATRIX_AUTO_UPDATE=!0;dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var un=new b,Sn=new b,Sa=new b,Dn=new b,qi=new b,Ki=new b,iu=new b,Da=new b,La=new b,Ra=new b,za=new Ke,Na=new Ke,Oa=new Ke,Ci=class s{constructor(e=new b,t=new b,n=new b){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),un.subVectors(e,t),i.cross(un);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){un.subVectors(i,t),Sn.subVectors(n,t),Sa.subVectors(e,t);let o=un.dot(un),a=un.dot(Sn),A=un.dot(Sa),c=Sn.dot(Sn),l=Sn.dot(Sa),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let h=1/u,d=(c*A-a*l)*h,p=(o*l-a*A)*h;return r.set(1-d-p,p,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(e,t,n,i,r,o,a,A){return this.getBarycoord(e,t,n,i,Dn)===null?(A.x=0,A.y=0,"z"in A&&(A.z=0),"w"in A&&(A.w=0),null):(A.setScalar(0),A.addScaledVector(r,Dn.x),A.addScaledVector(o,Dn.y),A.addScaledVector(a,Dn.z),A)}static getInterpolatedAttribute(e,t,n,i,r,o){return za.setScalar(0),Na.setScalar(0),Oa.setScalar(0),za.fromBufferAttribute(e,t),Na.fromBufferAttribute(e,n),Oa.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(za,r.x),o.addScaledVector(Na,r.y),o.addScaledVector(Oa,r.z),o}static isFrontFacing(e,t,n,i){return un.subVectors(n,t),Sn.subVectors(e,t),un.cross(Sn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return un.subVectors(this.c,this.b),Sn.subVectors(this.a,this.b),un.cross(Sn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return s.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return s.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return s.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return s.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return s.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,r=this.c,o,a;qi.subVectors(i,n),Ki.subVectors(r,n),Da.subVectors(e,n);let A=qi.dot(Da),c=Ki.dot(Da);if(A<=0&&c<=0)return t.copy(n);La.subVectors(e,i);let l=qi.dot(La),u=Ki.dot(La);if(l>=0&&u<=l)return t.copy(i);let h=A*u-l*c;if(h<=0&&A>=0&&l<=0)return o=A/(A-l),t.copy(n).addScaledVector(qi,o);Ra.subVectors(e,r);let d=qi.dot(Ra),p=Ki.dot(Ra);if(p>=0&&d<=p)return t.copy(r);let g=d*c-A*p;if(g<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(Ki,a);let m=l*p-d*u;if(m<=0&&u-l>=0&&d-p>=0)return iu.subVectors(r,i),a=(u-l)/(u-l+(d-p)),t.copy(i).addScaledVector(iu,a);let f=1/(m+g+h);return o=g*f,a=h*f,t.copy(n).addScaledVector(qi,o).addScaledVector(Ki,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},wh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ii={h:0,s:0,l:0},Zr={h:0,s:0,l:0};function Ba(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}var Le=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xe.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Xe.workingColorSpace){if(e=Bc(e,1),t=_t(t,0,1),n=_t(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Ba(o,r,e+1/3),this.g=Ba(o,r,e),this.b=Ba(o,r,e-1/3)}return Xe.toWorkingColorSpace(this,i),this}setStyle(e,t=gt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=gt){let n=wh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Bn(e.r),this.g=Bn(e.g),this.b=Bn(e.b),this}copyLinearToSRGB(e){return this.r=us(e.r),this.g=us(e.g),this.b=us(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=gt){return Xe.fromWorkingColorSpace(Ct.copy(this),e),Math.round(_t(Ct.r*255,0,255))*65536+Math.round(_t(Ct.g*255,0,255))*256+Math.round(_t(Ct.b*255,0,255))}getHexString(e=gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.fromWorkingColorSpace(Ct.copy(this),t);let n=Ct.r,i=Ct.g,r=Ct.b,o=Math.max(n,i,r),a=Math.min(n,i,r),A,c,l=(a+o)/2;if(a===o)A=0,c=0;else{let u=o-a;switch(c=l<=.5?u/(o+a):u/(2-o-a),o){case n:A=(i-r)/u+(i<r?6:0);break;case i:A=(r-n)/u+2;break;case r:A=(n-i)/u+4;break}A/=6}return e.h=A,e.s=c,e.l=l,e}getRGB(e,t=Xe.workingColorSpace){return Xe.fromWorkingColorSpace(Ct.copy(this),t),e.r=Ct.r,e.g=Ct.g,e.b=Ct.b,e}getStyle(e=gt){Xe.fromWorkingColorSpace(Ct.copy(this),e);let t=Ct.r,n=Ct.g,i=Ct.b;return e!==gt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(ii),this.setHSL(ii.h+e,ii.s+t,ii.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ii),e.getHSL(Zr);let n=qs(ii.h,Zr.h,t),i=qs(ii.s,Zr.s,t),r=qs(ii.l,Zr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ct=new Le;Le.NAMES=wh;var Of=0,Xt=class extends Zn{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=qt(),this.name="",this.blending=cs,this.side=Mn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tA,this.blendDst=nA,this.blendEquation=Ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Le(0,0,0),this.blendAlpha=0,this.depthFunc=ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Hi,this.stencilZFail=Hi,this.stencilZPass=Hi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==cs&&(n.blending=this.blending),this.side!==Mn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==tA&&(n.blendSrc=this.blendSrc),this.blendDst!==nA&&(n.blendDst=this.blendDst),this.blendEquation!==Ei&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ds&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Hi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Hi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Hi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let A=r[a];delete A.metadata,o.push(A)}return o}if(t){let r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},Gt=class extends Xt{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var mt=new b,Fr=new re,vt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=UA,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Fr.fromBufferAttribute(this,t),Fr.applyMatrix3(e),this.setXY(t,Fr.x,Fr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix3(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix4(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.applyNormalMatrix(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)mt.fromBufferAttribute(this,t),mt.transformDirection(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=hn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=it(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=hn(t,this.array)),t}setX(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=hn(t,this.array)),t}setY(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=hn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=hn(t,this.array)),t}setW(e,t){return this.normalized&&(t=it(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=it(t,this.array),n=it(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=it(t,this.array),n=it(n,this.array),i=it(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=it(t,this.array),n=it(n,this.array),i=it(i,this.array),r=it(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==UA&&(e.usage=this.usage),e}};var Mo=class extends vt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var vo=class extends vt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Mt=class extends vt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Bf=0,Qt=new Re,Ua=new dt,$i=new b,Ht=new Kt,Vs=new Kt,yt=new b,Nt=class s extends Zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Bf++}),this.uuid=qt(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(xh(e)?vo:Mo)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Fe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Qt.makeRotationFromQuaternion(e),this.applyMatrix4(Qt),this}rotateX(e){return Qt.makeRotationX(e),this.applyMatrix4(Qt),this}rotateY(e){return Qt.makeRotationY(e),this.applyMatrix4(Qt),this}rotateZ(e){return Qt.makeRotationZ(e),this.applyMatrix4(Qt),this}translate(e,t,n){return Qt.makeTranslation(e,t,n),this.applyMatrix4(Qt),this}scale(e,t,n){return Qt.makeScale(e,t,n),this.applyMatrix4(Qt),this}lookAt(e){return Ua.lookAt(e),Ua.updateMatrix(),this.applyMatrix4(Ua.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($i).negate(),this.translate($i.x,$i.y,$i.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,r=e.length;i<r;i++){let o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Mt(n,3))}else{for(let n=0,i=t.count;n<i;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Kt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new b(-1/0,-1/0,-1/0),new b(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let r=t[n];Ht.setFromBufferAttribute(r),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,Ht.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,Ht.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(Ht.min),this.boundingBox.expandByPoint(Ht.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new jt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new b,1/0);return}if(e){let n=this.boundingSphere.center;if(Ht.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Vs.setFromBufferAttribute(a),this.morphTargetsRelative?(yt.addVectors(Ht.min,Vs.min),Ht.expandByPoint(yt),yt.addVectors(Ht.max,Vs.max),Ht.expandByPoint(yt)):(Ht.expandByPoint(Vs.min),Ht.expandByPoint(Vs.max))}Ht.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)yt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(yt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],A=this.morphTargetsRelative;for(let c=0,l=a.count;c<l;c++)yt.fromBufferAttribute(a,c),A&&($i.fromBufferAttribute(e,c),yt.add($i)),i=Math.max(i,n.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],A=[];for(let D=0;D<n.count;D++)a[D]=new b,A[D]=new b;let c=new b,l=new b,u=new b,h=new re,d=new re,p=new re,g=new b,m=new b;function f(D,_,x){c.fromBufferAttribute(n,D),l.fromBufferAttribute(n,_),u.fromBufferAttribute(n,x),h.fromBufferAttribute(r,D),d.fromBufferAttribute(r,_),p.fromBufferAttribute(r,x),l.sub(c),u.sub(c),d.sub(h),p.sub(h);let S=1/(d.x*p.y-p.x*d.y);isFinite(S)&&(g.copy(l).multiplyScalar(p.y).addScaledVector(u,-d.y).multiplyScalar(S),m.copy(u).multiplyScalar(d.x).addScaledVector(l,-p.x).multiplyScalar(S),a[D].add(g),a[_].add(g),a[x].add(g),A[D].add(m),A[_].add(m),A[x].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let D=0,_=T.length;D<_;++D){let x=T[D],S=x.start,V=x.count;for(let B=S,F=S+V;B<F;B+=3)f(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let y=new b,M=new b,R=new b,E=new b;function C(D){R.fromBufferAttribute(i,D),E.copy(R);let _=a[D];y.copy(_),y.sub(R.multiplyScalar(R.dot(_))).normalize(),M.crossVectors(E,_);let S=M.dot(A[D])<0?-1:1;o.setXYZW(D,y.x,y.y,y.z,S)}for(let D=0,_=T.length;D<_;++D){let x=T[D],S=x.start,V=x.count;for(let B=S,F=S+V;B<F;B+=3)C(e.getX(B+0)),C(e.getX(B+1)),C(e.getX(B+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new vt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,d=n.count;h<d;h++)n.setXYZ(h,0,0,0);let i=new b,r=new b,o=new b,a=new b,A=new b,c=new b,l=new b,u=new b;if(e)for(let h=0,d=e.count;h<d;h+=3){let p=e.getX(h+0),g=e.getX(h+1),m=e.getX(h+2);i.fromBufferAttribute(t,p),r.fromBufferAttribute(t,g),o.fromBufferAttribute(t,m),l.subVectors(o,r),u.subVectors(i,r),l.cross(u),a.fromBufferAttribute(n,p),A.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),a.add(l),A.add(l),c.add(l),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(g,A.x,A.y,A.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=t.count;h<d;h+=3)i.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),l.subVectors(o,r),u.subVectors(i,r),l.cross(u),n.setXYZ(h+0,l.x,l.y,l.z),n.setXYZ(h+1,l.x,l.y,l.z),n.setXYZ(h+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(a,A){let c=a.array,l=a.itemSize,u=a.normalized,h=new c.constructor(A.length*l),d=0,p=0;for(let g=0,m=A.length;g<m;g++){a.isInterleavedBufferAttribute?d=A[g]*a.data.stride+a.offset:d=A[g]*l;for(let f=0;f<l;f++)h[p++]=c[d++]}return new vt(h,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new s,n=this.index.array,i=this.attributes;for(let a in i){let A=i[a],c=e(A,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let A=[],c=r[a];for(let l=0,u=c.length;l<u;l++){let h=c[l],d=e(h,n);A.push(d)}t.morphAttributes[a]=A}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,A=o.length;a<A;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let A=this.parameters;for(let c in A)A[c]!==void 0&&(e[c]=A[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let A in n){let c=n[A];e.data.attributes[A]=c.toJSON(e.data)}let i={},r=!1;for(let A in this.morphAttributes){let c=this.morphAttributes[A],l=[];for(let u=0,h=c.length;u<h;u++){let d=c[u];l.push(d.toJSON(e.data))}l.length>0&&(i[A]=l,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let i=e.attributes;for(let c in i){let l=i[c];this.setAttribute(c,l.clone(t))}let r=e.morphAttributes;for(let c in r){let l=[],u=r[c];for(let h=0,d=u.length;h<d;h++)l.push(u[h].clone(t));this.morphAttributes[c]=l}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,l=o.length;c<l;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let A=e.boundingSphere;return A!==null&&(this.boundingSphere=A.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},su=new Re,_i=new Ri,kr=new jt,ru=new b,Vr=new b,Hr=new b,jr=new b,Za=new b,Xr=new b,ou=new b,Gr=new b,At=class extends dt{constructor(e=new Nt,t=new Gt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(r&&a){Xr.set(0,0,0);for(let A=0,c=r.length;A<c;A++){let l=a[A],u=r[A];l!==0&&(Za.fromBufferAttribute(u,e),o?Xr.addScaledVector(Za,l):Xr.addScaledVector(Za.sub(t),l))}t.add(Xr)}return t}raycast(e,t){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),kr.copy(n.boundingSphere),kr.applyMatrix4(r),_i.copy(e.ray).recast(e.near),!(kr.containsPoint(_i.origin)===!1&&(_i.intersectSphere(kr,ru)===null||_i.origin.distanceToSquared(ru)>(e.far-e.near)**2))&&(su.copy(r).invert(),_i.copy(e.ray).applyMatrix4(su),!(n.boundingBox!==null&&_i.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,_i)))}_computeIntersections(e,t,n){let i,r=this.geometry,o=this.material,a=r.index,A=r.attributes.position,c=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,h=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,g=h.length;p<g;p++){let m=h[p],f=o[m.materialIndex],T=Math.max(m.start,d.start),y=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let M=T,R=y;M<R;M+=3){let E=a.getX(M),C=a.getX(M+1),D=a.getX(M+2);i=Yr(this,f,e,n,c,l,u,E,C,D),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let p=Math.max(0,d.start),g=Math.min(a.count,d.start+d.count);for(let m=p,f=g;m<f;m+=3){let T=a.getX(m),y=a.getX(m+1),M=a.getX(m+2);i=Yr(this,o,e,n,c,l,u,T,y,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(A!==void 0)if(Array.isArray(o))for(let p=0,g=h.length;p<g;p++){let m=h[p],f=o[m.materialIndex],T=Math.max(m.start,d.start),y=Math.min(A.count,Math.min(m.start+m.count,d.start+d.count));for(let M=T,R=y;M<R;M+=3){let E=M,C=M+1,D=M+2;i=Yr(this,f,e,n,c,l,u,E,C,D),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let p=Math.max(0,d.start),g=Math.min(A.count,d.start+d.count);for(let m=p,f=g;m<f;m+=3){let T=m,y=m+1,M=m+2;i=Yr(this,o,e,n,c,l,u,T,y,M),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}};function Uf(s,e,t,n,i,r,o,a){let A;if(e.side===Zt?A=n.intersectTriangle(o,r,i,!0,a):A=n.intersectTriangle(i,r,o,e.side===Mn,a),A===null)return null;Gr.copy(a),Gr.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(Gr);return c<t.near||c>t.far?null:{distance:c,point:Gr.clone(),object:s}}function Yr(s,e,t,n,i,r,o,a,A,c){s.getVertexPosition(a,Vr),s.getVertexPosition(A,Hr),s.getVertexPosition(c,jr);let l=Uf(s,e,t,n,Vr,Hr,jr,ou);if(l){let u=new b;Ci.getBarycoord(ou,Vr,Hr,jr,u),i&&(l.uv=Ci.getInterpolatedAttribute(i,a,A,c,u,new re)),r&&(l.uv1=Ci.getInterpolatedAttribute(r,a,A,c,u,new re)),o&&(l.normal=Ci.getInterpolatedAttribute(o,a,A,c,u,new b),l.normal.dot(n.direction)>0&&l.normal.multiplyScalar(-1));let h={a,b:A,c,normal:new b,materialIndex:0};Ci.getNormal(Vr,Hr,jr,h.normal),l.face=h,l.barycoord=u}return l}var zi=class s extends Nt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let A=[],c=[],l=[],u=[],h=0,d=0;p("z","y","x",-1,-1,n,t,e,o,r,0),p("z","y","x",1,-1,n,t,-e,o,r,1),p("x","z","y",1,1,e,n,t,i,o,2),p("x","z","y",1,-1,e,n,-t,i,o,3),p("x","y","z",1,-1,e,t,n,i,r,4),p("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(A),this.setAttribute("position",new Mt(c,3)),this.setAttribute("normal",new Mt(l,3)),this.setAttribute("uv",new Mt(u,2));function p(g,m,f,T,y,M,R,E,C,D,_){let x=M/C,S=R/D,V=M/2,B=R/2,F=E/2,W=C+1,k=D+1,ee=0,H=0,ae=new b;for(let fe=0;fe<k;fe++){let xe=fe*S-B;for(let Be=0;Be<W;Be++){let $e=Be*x-V;ae[g]=$e*T,ae[m]=xe*y,ae[f]=F,c.push(ae.x,ae.y,ae.z),ae[g]=0,ae[m]=0,ae[f]=E>0?1:-1,l.push(ae.x,ae.y,ae.z),u.push(Be/C),u.push(1-fe/D),ee+=1}}for(let fe=0;fe<D;fe++)for(let xe=0;xe<C;xe++){let Be=h+xe+W*fe,$e=h+xe+W*(fe+1),Y=h+(xe+1)+W*(fe+1),ne=h+(xe+1)+W*fe;A.push(Be,$e,ne),A.push($e,Y,ne),H+=6}a.addGroup(d,H,_),d+=H,h+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function ws(s){let e={};for(let t in s){e[t]={};for(let n in s[t]){let i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Rt(s){let e={};for(let t=0;t<s.length;t++){let n=ws(s[t]);for(let i in n)e[i]=n[i]}return e}function Zf(s){let e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function yh(s){let e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Xe.workingColorSpace}var Ff={clone:ws,merge:Rt},kf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Vf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,xn=class extends Xt{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=kf,this.fragmentShader=Vf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ws(e.uniforms),this.uniformsGroups=Zf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},xo=class extends dt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Re,this.projectionMatrix=new Re,this.projectionMatrixInverse=new Re,this.coordinateSystem=On}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},si=new b,au=new re,Au=new re,Tt=class extends xo{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=xs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Js*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return xs*2*Math.atan(Math.tan(Js*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(si.x,si.y).multiplyScalar(-e/si.z),si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(si.x,si.y).multiplyScalar(-e/si.z)}getViewSize(e,t){return this.getViewBounds(e,au,Au),t.subVectors(Au,au)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Js*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let A=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/A,t-=o.offsetY*n/c,i*=o.width/A,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},es=-90,ts=1,VA=class extends dt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Tt(es,ts,e,t);i.layers=this.layers,this.add(i);let r=new Tt(es,ts,e,t);r.layers=this.layers,this.add(r);let o=new Tt(es,ts,e,t);o.layers=this.layers,this.add(o);let a=new Tt(es,ts,e,t);a.layers=this.layers,this.add(a);let A=new Tt(es,ts,e,t);A.layers=this.layers,this.add(A);let c=new Tt(es,ts,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,A]=t;for(let c of t)this.remove(c);if(e===On)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),A.up.set(0,1,0),A.lookAt(0,0,-1);else if(e===po)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),A.up.set(0,-1,0),A.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,A,c,l]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,a),e.setRenderTarget(n,3,i),e.render(t,A),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,i),e.render(t,l),e.setRenderTarget(u,h,d),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},wo=class extends It{constructor(e,t,n,i,r,o,a,A,c,l){e=e!==void 0?e:[],t=t!==void 0?t:fs,super(e,t,n,i,r,o,a,A,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},HA=class extends Fn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new wo(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ut}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new zi(5,5,5),r=new xn({name:"CubemapFromEquirect",uniforms:ws(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Zt,blending:ai});r.uniforms.tEquirect.value=t;let o=new At(i,r),a=t.minFilter;return t.minFilter===gn&&(t.minFilter=Ut),new VA(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,i){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}},Fa=new b,Hf=new b,jf=new Fe,zn=class{constructor(e=new b(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=Fa.subVectors(n,t).cross(Hf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Fa),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||jf.getNormalMatrix(e),i=this.coplanarPoint(Fa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ti=new jt,Wr=new b,or=class{constructor(e=new zn,t=new zn,n=new zn,i=new zn,r=new zn,o=new zn){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=On){let n=this.planes,i=e.elements,r=i[0],o=i[1],a=i[2],A=i[3],c=i[4],l=i[5],u=i[6],h=i[7],d=i[8],p=i[9],g=i[10],m=i[11],f=i[12],T=i[13],y=i[14],M=i[15];if(n[0].setComponents(A-r,h-c,m-d,M-f).normalize(),n[1].setComponents(A+r,h+c,m+d,M+f).normalize(),n[2].setComponents(A+o,h+l,m+p,M+T).normalize(),n[3].setComponents(A-o,h-l,m-p,M-T).normalize(),n[4].setComponents(A-a,h-u,m-g,M-y).normalize(),t===On)n[5].setComponents(A+a,h+u,m+g,M+y).normalize();else if(t===po)n[5].setComponents(a,u,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ti.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ti.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ti)}intersectsSprite(e){return Ti.center.set(0,0,0),Ti.radius=.7071067811865476,Ti.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ti)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Wr.x=i.normal.x>0?e.max.x:e.min.x,Wr.y=i.normal.y>0?e.max.y:e.min.y,Wr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function _h(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Xf(s){let e=new WeakMap;function t(a,A){let c=a.array,l=a.usage,u=c.byteLength,h=s.createBuffer();s.bindBuffer(A,h),s.bufferData(A,c,l),a.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,A,c){let l=A.array,u=A.updateRanges;if(s.bindBuffer(c,a),u.length===0)s.bufferSubData(c,0,l);else{u.sort((d,p)=>d.start-p.start);let h=0;for(let d=1;d<u.length;d++){let p=u[h],g=u[d];g.start<=p.start+p.count+1?p.count=Math.max(p.count,g.start+g.count-p.start):(++h,u[h]=g)}u.length=h+1;for(let d=0,p=u.length;d<p;d++){let g=u[d];s.bufferSubData(c,g.start*l.BYTES_PER_ELEMENT,l,g.start,g.count)}A.clearUpdateRanges()}A.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let A=e.get(a);A&&(s.deleteBuffer(A.buffer),e.delete(a))}function o(a,A){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let l=e.get(a);(!l||l.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,A));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,A),c.version=a.version}}return{get:i,remove:r,update:o}}var Ni=class s extends Nt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let r=e/2,o=t/2,a=Math.floor(n),A=Math.floor(i),c=a+1,l=A+1,u=e/a,h=t/A,d=[],p=[],g=[],m=[];for(let f=0;f<l;f++){let T=f*h-o;for(let y=0;y<c;y++){let M=y*u-r;p.push(M,-T,0),g.push(0,0,1),m.push(y/a),m.push(1-f/A)}}for(let f=0;f<A;f++)for(let T=0;T<a;T++){let y=T+c*f,M=T+c*(f+1),R=T+1+c*(f+1),E=T+1+c*f;d.push(y,M,E),d.push(M,R,E)}this.setIndex(d),this.setAttribute("position",new Mt(p,3)),this.setAttribute("normal",new Mt(g,3)),this.setAttribute("uv",new Mt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.widthSegments,e.heightSegments)}},Gf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Wf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Qf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Kf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,$f=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ep=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,tp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,np=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ip=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,sp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,op=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ap=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,up=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,hp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,dp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,fp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,pp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,mp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,gp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Mp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,wp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yp="gl_FragColor = linearToOutputTexel( gl_FragColor );",_p=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ip=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Pp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,bp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ep=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Cp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Dp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Lp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Rp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,zp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Np=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Op=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Up=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Zp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Hp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,jp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Xp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Gp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Yp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Qp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Kp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$p=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,em=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,tm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,im=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,om=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,am=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Am=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,lm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,um=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,fm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,pm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Mm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,wm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ym=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_m=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Im=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Pm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Em=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Sm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Dm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Lm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Rm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Nm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Om=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Um=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,jm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Xm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Km=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,$m=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,eg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ng=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,og=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ag=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ag=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,lg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ug=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,hg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,dg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,mg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Mg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,_g=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Tg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ve={alphahash_fragment:Gf,alphahash_pars_fragment:Yf,alphamap_fragment:Wf,alphamap_pars_fragment:Qf,alphatest_fragment:Jf,alphatest_pars_fragment:qf,aomap_fragment:Kf,aomap_pars_fragment:$f,batching_pars_vertex:ep,batching_vertex:tp,begin_vertex:np,beginnormal_vertex:ip,bsdfs:sp,iridescence_fragment:rp,bumpmap_pars_fragment:op,clipping_planes_fragment:ap,clipping_planes_pars_fragment:Ap,clipping_planes_pars_vertex:cp,clipping_planes_vertex:lp,color_fragment:up,color_pars_fragment:hp,color_pars_vertex:dp,color_vertex:fp,common:pp,cube_uv_reflection_fragment:mp,defaultnormal_vertex:gp,displacementmap_pars_vertex:Mp,displacementmap_vertex:vp,emissivemap_fragment:xp,emissivemap_pars_fragment:wp,colorspace_fragment:yp,colorspace_pars_fragment:_p,envmap_fragment:Tp,envmap_common_pars_fragment:Ip,envmap_pars_fragment:Pp,envmap_pars_vertex:bp,envmap_physical_pars_fragment:Up,envmap_vertex:Ep,fog_vertex:Cp,fog_pars_vertex:Sp,fog_fragment:Dp,fog_pars_fragment:Lp,gradientmap_pars_fragment:Rp,lightmap_pars_fragment:zp,lights_lambert_fragment:Np,lights_lambert_pars_fragment:Op,lights_pars_begin:Bp,lights_toon_fragment:Zp,lights_toon_pars_fragment:Fp,lights_phong_fragment:kp,lights_phong_pars_fragment:Vp,lights_physical_fragment:Hp,lights_physical_pars_fragment:jp,lights_fragment_begin:Xp,lights_fragment_maps:Gp,lights_fragment_end:Yp,logdepthbuf_fragment:Wp,logdepthbuf_pars_fragment:Qp,logdepthbuf_pars_vertex:Jp,logdepthbuf_vertex:qp,map_fragment:Kp,map_pars_fragment:$p,map_particle_fragment:em,map_particle_pars_fragment:tm,metalnessmap_fragment:nm,metalnessmap_pars_fragment:im,morphinstance_vertex:sm,morphcolor_vertex:rm,morphnormal_vertex:om,morphtarget_pars_vertex:am,morphtarget_vertex:Am,normal_fragment_begin:cm,normal_fragment_maps:lm,normal_pars_fragment:um,normal_pars_vertex:hm,normal_vertex:dm,normalmap_pars_fragment:fm,clearcoat_normal_fragment_begin:pm,clearcoat_normal_fragment_maps:mm,clearcoat_pars_fragment:gm,iridescence_pars_fragment:Mm,opaque_fragment:vm,packing:xm,premultiplied_alpha_fragment:wm,project_vertex:ym,dithering_fragment:_m,dithering_pars_fragment:Tm,roughnessmap_fragment:Im,roughnessmap_pars_fragment:Pm,shadowmap_pars_fragment:bm,shadowmap_pars_vertex:Em,shadowmap_vertex:Cm,shadowmask_pars_fragment:Sm,skinbase_vertex:Dm,skinning_pars_vertex:Lm,skinning_vertex:Rm,skinnormal_vertex:zm,specularmap_fragment:Nm,specularmap_pars_fragment:Om,tonemapping_fragment:Bm,tonemapping_pars_fragment:Um,transmission_fragment:Zm,transmission_pars_fragment:Fm,uv_pars_fragment:km,uv_pars_vertex:Vm,uv_vertex:Hm,worldpos_vertex:jm,background_vert:Xm,background_frag:Gm,backgroundCube_vert:Ym,backgroundCube_frag:Wm,cube_vert:Qm,cube_frag:Jm,depth_vert:qm,depth_frag:Km,distanceRGBA_vert:$m,distanceRGBA_frag:eg,equirect_vert:tg,equirect_frag:ng,linedashed_vert:ig,linedashed_frag:sg,meshbasic_vert:rg,meshbasic_frag:og,meshlambert_vert:ag,meshlambert_frag:Ag,meshmatcap_vert:cg,meshmatcap_frag:lg,meshnormal_vert:ug,meshnormal_frag:hg,meshphong_vert:dg,meshphong_frag:fg,meshphysical_vert:pg,meshphysical_frag:mg,meshtoon_vert:gg,meshtoon_frag:Mg,points_vert:vg,points_frag:xg,shadow_vert:wg,shadow_frag:yg,sprite_vert:_g,sprite_frag:Tg},Ae={common:{diffuse:{value:new Le(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new re(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Le(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Le(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Le(16777215)},opacity:{value:1},center:{value:new re(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},mn={basic:{uniforms:Rt([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:Rt([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new Le(0)}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:Rt([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new Le(0)},specular:{value:new Le(1118481)},shininess:{value:30}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:Rt([Ae.common,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.roughnessmap,Ae.metalnessmap,Ae.fog,Ae.lights,{emissive:{value:new Le(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:Rt([Ae.common,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.gradientmap,Ae.fog,Ae.lights,{emissive:{value:new Le(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:Rt([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:Rt([Ae.points,Ae.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:Rt([Ae.common,Ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:Rt([Ae.common,Ae.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:Rt([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:Rt([Ae.sprite,Ae.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distanceRGBA:{uniforms:Rt([Ae.common,Ae.displacementmap,{referencePosition:{value:new b},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distanceRGBA_vert,fragmentShader:Ve.distanceRGBA_frag},shadow:{uniforms:Rt([Ae.lights,Ae.fog,{color:{value:new Le(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};mn.physical={uniforms:Rt([mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new re(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Le(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new re},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Le(0)},specularColor:{value:new Le(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new re},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};var Qr={r:0,b:0,g:0},Ii=new vn,Ig=new Re;function Pg(s,e,t,n,i,r,o){let a=new Le(0),A=r===!0?0:1,c,l,u=null,h=0,d=null;function p(T){let y=T.isScene===!0?T.background:null;return y&&y.isTexture&&(y=(T.backgroundBlurriness>0?t:e).get(y)),y}function g(T){let y=!1,M=p(T);M===null?f(a,A):M&&M.isColor&&(f(M,1),y=!0);let R=s.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(T,y){let M=p(y);M&&(M.isCubeTexture||M.mapping===Jo)?(l===void 0&&(l=new At(new zi(1,1,1),new xn({name:"BackgroundCubeMaterial",uniforms:ws(mn.backgroundCube.uniforms),vertexShader:mn.backgroundCube.vertexShader,fragmentShader:mn.backgroundCube.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(R,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),Ii.copy(y.backgroundRotation),Ii.x*=-1,Ii.y*=-1,Ii.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Ii.y*=-1,Ii.z*=-1),l.material.uniforms.envMap.value=M,l.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Ig.makeRotationFromEuler(Ii)),l.material.toneMapped=Xe.getTransfer(M.colorSpace)!==rt,(u!==M||h!==M.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,u=M,h=M.version,d=s.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new At(new Ni(2,2),new xn({name:"BackgroundMaterial",uniforms:ws(mn.background.uniforms),vertexShader:mn.background.vertexShader,fragmentShader:mn.background.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Xe.getTransfer(M.colorSpace)!==rt,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||h!==M.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=M,h=M.version,d=s.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function f(T,y){T.getRGB(Qr,yh(s)),n.buffers.color.setClear(Qr.r,Qr.g,Qr.b,y,o)}return{getClearColor:function(){return a},setClearColor:function(T,y=1){a.set(T),A=y,f(a,A)},getClearAlpha:function(){return A},setClearAlpha:function(T){A=T,f(a,A)},render:g,addToRenderList:m}}function bg(s,e){let t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=h(null),r=i,o=!1;function a(x,S,V,B,F){let W=!1,k=u(B,V,S);r!==k&&(r=k,c(r.object)),W=d(x,B,V,F),W&&p(x,B,V,F),F!==null&&e.update(F,s.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,M(x,S,V,B),F!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function A(){return s.createVertexArray()}function c(x){return s.bindVertexArray(x)}function l(x){return s.deleteVertexArray(x)}function u(x,S,V){let B=V.wireframe===!0,F=n[x.id];F===void 0&&(F={},n[x.id]=F);let W=F[S.id];W===void 0&&(W={},F[S.id]=W);let k=W[B];return k===void 0&&(k=h(A()),W[B]=k),k}function h(x){let S=[],V=[],B=[];for(let F=0;F<t;F++)S[F]=0,V[F]=0,B[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:V,attributeDivisors:B,object:x,attributes:{},index:null}}function d(x,S,V,B){let F=r.attributes,W=S.attributes,k=0,ee=V.getAttributes();for(let H in ee)if(ee[H].location>=0){let fe=F[H],xe=W[H];if(xe===void 0&&(H==="instanceMatrix"&&x.instanceMatrix&&(xe=x.instanceMatrix),H==="instanceColor"&&x.instanceColor&&(xe=x.instanceColor)),fe===void 0||fe.attribute!==xe||xe&&fe.data!==xe.data)return!0;k++}return r.attributesNum!==k||r.index!==B}function p(x,S,V,B){let F={},W=S.attributes,k=0,ee=V.getAttributes();for(let H in ee)if(ee[H].location>=0){let fe=W[H];fe===void 0&&(H==="instanceMatrix"&&x.instanceMatrix&&(fe=x.instanceMatrix),H==="instanceColor"&&x.instanceColor&&(fe=x.instanceColor));let xe={};xe.attribute=fe,fe&&fe.data&&(xe.data=fe.data),F[H]=xe,k++}r.attributes=F,r.attributesNum=k,r.index=B}function g(){let x=r.newAttributes;for(let S=0,V=x.length;S<V;S++)x[S]=0}function m(x){f(x,0)}function f(x,S){let V=r.newAttributes,B=r.enabledAttributes,F=r.attributeDivisors;V[x]=1,B[x]===0&&(s.enableVertexAttribArray(x),B[x]=1),F[x]!==S&&(s.vertexAttribDivisor(x,S),F[x]=S)}function T(){let x=r.newAttributes,S=r.enabledAttributes;for(let V=0,B=S.length;V<B;V++)S[V]!==x[V]&&(s.disableVertexAttribArray(V),S[V]=0)}function y(x,S,V,B,F,W,k){k===!0?s.vertexAttribIPointer(x,S,V,F,W):s.vertexAttribPointer(x,S,V,B,F,W)}function M(x,S,V,B){g();let F=B.attributes,W=V.getAttributes(),k=S.defaultAttributeValues;for(let ee in W){let H=W[ee];if(H.location>=0){let ae=F[ee];if(ae===void 0&&(ee==="instanceMatrix"&&x.instanceMatrix&&(ae=x.instanceMatrix),ee==="instanceColor"&&x.instanceColor&&(ae=x.instanceColor)),ae!==void 0){let fe=ae.normalized,xe=ae.itemSize,Be=e.get(ae);if(Be===void 0)continue;let $e=Be.buffer,Y=Be.type,ne=Be.bytesPerElement,we=Y===s.INT||Y===s.UNSIGNED_INT||ae.gpuType===bc;if(ae.isInterleavedBufferAttribute){let se=ae.data,Ee=se.stride,Ne=ae.offset;if(se.isInstancedInterleavedBuffer){for(let De=0;De<H.locationSize;De++)f(H.location+De,se.meshPerAttribute);x.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let De=0;De<H.locationSize;De++)m(H.location+De);s.bindBuffer(s.ARRAY_BUFFER,$e);for(let De=0;De<H.locationSize;De++)y(H.location+De,xe/H.locationSize,Y,fe,Ee*ne,(Ne+xe/H.locationSize*De)*ne,we)}else{if(ae.isInstancedBufferAttribute){for(let se=0;se<H.locationSize;se++)f(H.location+se,ae.meshPerAttribute);x.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let se=0;se<H.locationSize;se++)m(H.location+se);s.bindBuffer(s.ARRAY_BUFFER,$e);for(let se=0;se<H.locationSize;se++)y(H.location+se,xe/H.locationSize,Y,fe,xe*ne,xe/H.locationSize*se*ne,we)}}else if(k!==void 0){let fe=k[ee];if(fe!==void 0)switch(fe.length){case 2:s.vertexAttrib2fv(H.location,fe);break;case 3:s.vertexAttrib3fv(H.location,fe);break;case 4:s.vertexAttrib4fv(H.location,fe);break;default:s.vertexAttrib1fv(H.location,fe)}}}}T()}function R(){D();for(let x in n){let S=n[x];for(let V in S){let B=S[V];for(let F in B)l(B[F].object),delete B[F];delete S[V]}delete n[x]}}function E(x){if(n[x.id]===void 0)return;let S=n[x.id];for(let V in S){let B=S[V];for(let F in B)l(B[F].object),delete B[F];delete S[V]}delete n[x.id]}function C(x){for(let S in n){let V=n[S];if(V[x.id]===void 0)continue;let B=V[x.id];for(let F in B)l(B[F].object),delete B[F];delete V[x.id]}}function D(){_(),o=!0,r!==i&&(r=i,c(r.object))}function _(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:D,resetDefaultState:_,dispose:R,releaseStatesOfGeometry:E,releaseStatesOfProgram:C,initAttributes:g,enableAttribute:m,disableUnusedAttributes:T}}function Eg(s,e,t){let n;function i(c){n=c}function r(c,l){s.drawArrays(n,c,l),t.update(l,n,1)}function o(c,l,u){u!==0&&(s.drawArraysInstanced(n,c,l,u),t.update(l,n,u))}function a(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,u);let d=0;for(let p=0;p<u;p++)d+=l[p];t.update(d,n,1)}function A(c,l,u,h){if(u===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let p=0;p<c.length;p++)o(c[p],l[p],h[p]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,l,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=l[g]*h[g];t.update(p,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=A}function Cg(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(C){return!(C!==Jt&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let D=C===wr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Un&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==dn&&!D)}function A(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",l=A(c);l!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",l,"instead."),c=l);let u=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),f=s.getParameter(s.MAX_VERTEX_ATTRIBS),T=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),y=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),R=p>0,E=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:A,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:h,maxTextures:d,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:T,maxVaryings:y,maxFragmentUniforms:M,vertexTextures:R,maxSamples:E}}function Sg(s){let e=this,t=null,n=0,i=!1,r=!1,o=new zn,a=new Fe,A={value:null,needsUpdate:!1};this.uniform=A,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){let d=u.length!==0||h||n!==0||i;return i=h,n=u.length,d},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,h){t=l(u,h,0)},this.setState=function(u,h,d){let p=u.clippingPlanes,g=u.clipIntersection,m=u.clipShadows,f=s.get(u);if(!i||p===null||p.length===0||r&&!m)r?l(null):c();else{let T=r?0:n,y=T*4,M=f.clippingState||null;A.value=M,M=l(p,h,y,d);for(let R=0;R!==y;++R)M[R]=t[R];f.clippingState=M,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=T}};function c(){A.value!==t&&(A.value=t,A.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function l(u,h,d,p){let g=u!==null?u.length:0,m=null;if(g!==0){if(m=A.value,p!==!0||m===null){let f=d+g*4,T=h.matrixWorldInverse;a.getNormalMatrix(T),(m===null||m.length<f)&&(m=new Float32Array(f));for(let y=0,M=d;y!==g;++y,M+=4)o.copy(u[y]).applyMatrix4(T,a),o.normal.toArray(m,M),m[M+3]=o.constant}A.value=m,A.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}function Dg(s){let e=new WeakMap;function t(o,a){return a===lA?o.mapping=fs:a===uA&&(o.mapping=ps),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===lA||a===uA)if(e.has(o)){let A=e.get(o).texture;return t(A,o.mapping)}else{let A=o.image;if(A&&A.height>0){let c=new HA(A.height);return c.fromEquirectangularTexture(s,o),e.set(o,c),o.addEventListener("dispose",i),t(c.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let A=e.get(a);A!==void 0&&(e.delete(a),A.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var ci=class extends xo{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-e,o=n+e,a=i+t,A=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=l*this.view.offsetY,A=a-l*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,A,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},as=4,cu=[.125,.215,.35,.446,.526,.582],Si=20,ka=new ci,lu=new Le,Va=null,Ha=0,ja=0,Xa=!1,bi=(1+Math.sqrt(5))/2,ns=1/bi,uu=[new b(-bi,ns,0),new b(bi,ns,0),new b(-ns,0,bi),new b(ns,0,bi),new b(0,bi,-ns),new b(0,bi,ns),new b(-1,1,-1),new b(1,1,-1),new b(-1,1,1),new b(1,1,1)],yo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){Va=this._renderer.getRenderTarget(),Ha=this._renderer.getActiveCubeFace(),ja=this._renderer.getActiveMipmapLevel(),Xa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=du(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Va,Ha,ja),this._renderer.xr.enabled=Xa,e.scissorTest=!1,Jr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===fs||e.mapping===ps?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Va=this._renderer.getRenderTarget(),Ha=this._renderer.getActiveCubeFace(),ja=this._renderer.getActiveMipmapLevel(),Xa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:wr,format:Jt,colorSpace:Dt,depthBuffer:!1},i=hu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hu(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Lg(r)),this._blurMaterial=Rg(r,e,t)}return i}_compileMaterial(e){let t=new At(this._lodPlanes[0],e);this._renderer.compile(t,ka)}_sceneToCubeUV(e,t,n,i){let a=new Tt(90,1,t,n),A=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,h=l.toneMapping;l.getClearColor(lu),l.toneMapping=Ai,l.autoClear=!1;let d=new Gt({name:"PMREM.Background",side:Zt,depthWrite:!1,depthTest:!1}),p=new At(new zi,d),g=!1,m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,g=!0):(d.color.copy(lu),g=!0);for(let f=0;f<6;f++){let T=f%3;T===0?(a.up.set(0,A[f],0),a.lookAt(c[f],0,0)):T===1?(a.up.set(0,0,A[f]),a.lookAt(0,c[f],0)):(a.up.set(0,A[f],0),a.lookAt(0,0,c[f]));let y=this._cubeSize;Jr(i,T*y,f>2?y:0,y,y),l.setRenderTarget(i),g&&l.render(p,a),l.render(e,a)}p.geometry.dispose(),p.material.dispose(),l.toneMapping=h,l.autoClear=u,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===fs||e.mapping===ps;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=fu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=du());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new At(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let A=this._cubeSize;Jr(t,0,0,3*A,2*A),n.setRenderTarget(t),n.render(o,ka)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=uu[(i-r-1)%uu.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,a){let A=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let l=3,u=new At(this._lodPlanes[i],c),h=c.uniforms,d=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Si-1),g=r/p,m=isFinite(r)?1+Math.floor(l*g):Si;m>Si&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Si}`);let f=[],T=0;for(let C=0;C<Si;++C){let D=C/g,_=Math.exp(-D*D/2);f.push(_),C===0?T+=_:C<m&&(T+=2*_)}for(let C=0;C<f.length;C++)f[C]=f[C]/T;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=f,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);let{_lodMax:y}=this;h.dTheta.value=p,h.mipInt.value=y-n;let M=this._sizeLods[i],R=3*M*(i>y-as?i-y+as:0),E=4*(this._cubeSize-M);Jr(t,R,E,3*M,2*M),A.setRenderTarget(t),A.render(u,ka)}};function Lg(s){let e=[],t=[],n=[],i=s,r=s-as+1+cu.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);t.push(a);let A=1/a;o>s-as?A=cu[o-s+as-1]:o===0&&(A=0),n.push(A);let c=1/(a-2),l=-c,u=1+c,h=[l,l,u,l,u,u,l,l,u,u,l,u],d=6,p=6,g=3,m=2,f=1,T=new Float32Array(g*p*d),y=new Float32Array(m*p*d),M=new Float32Array(f*p*d);for(let E=0;E<d;E++){let C=E%3*2/3-1,D=E>2?0:-1,_=[C,D,0,C+2/3,D,0,C+2/3,D+1,0,C,D,0,C+2/3,D+1,0,C,D+1,0];T.set(_,g*p*E),y.set(h,m*p*E);let x=[E,E,E,E,E,E];M.set(x,f*p*E)}let R=new Nt;R.setAttribute("position",new vt(T,g)),R.setAttribute("uv",new vt(y,m)),R.setAttribute("faceIndex",new vt(M,f)),e.push(R),i>as&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function hu(s,e,t){let n=new Fn(s,e,t);return n.texture.mapping=Jo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Jr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Rg(s,e,t){let n=new Float32Array(Si),i=new b(0,1,0);return new xn({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ai,depthTest:!1,depthWrite:!1})}function du(){return new xn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ai,depthTest:!1,depthWrite:!1})}function fu(){return new xn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Uc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ai,depthTest:!1,depthWrite:!1})}function Uc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function zg(s){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let A=a.mapping,c=A===lA||A===uA,l=A===fs||A===ps;if(c||l){let u=e.get(a),h=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new yo(s)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let d=a.image;return c&&d&&d.height>0||l&&d&&i(d)?(t===null&&(t=new yo(s)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let A=0,c=6;for(let l=0;l<c;l++)a[l]!==void 0&&A++;return A===c}function r(a){let A=a.target;A.removeEventListener("dispose",r);let c=e.get(A);c!==void 0&&(e.delete(A),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Ng(s){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&Ys("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Og(s,e,t,n){let i={},r=new WeakMap;function o(u){let h=u.target;h.index!==null&&e.remove(h.index);for(let p in h.attributes)e.remove(h.attributes[p]);for(let p in h.morphAttributes){let g=h.morphAttributes[p];for(let m=0,f=g.length;m<f;m++)e.remove(g[m])}h.removeEventListener("dispose",o),delete i[h.id];let d=r.get(h);d&&(e.remove(d),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(u,h){return i[h.id]===!0||(h.addEventListener("dispose",o),i[h.id]=!0,t.memory.geometries++),h}function A(u){let h=u.attributes;for(let p in h)e.update(h[p],s.ARRAY_BUFFER);let d=u.morphAttributes;for(let p in d){let g=d[p];for(let m=0,f=g.length;m<f;m++)e.update(g[m],s.ARRAY_BUFFER)}}function c(u){let h=[],d=u.index,p=u.attributes.position,g=0;if(d!==null){let T=d.array;g=d.version;for(let y=0,M=T.length;y<M;y+=3){let R=T[y+0],E=T[y+1],C=T[y+2];h.push(R,E,E,C,C,R)}}else if(p!==void 0){let T=p.array;g=p.version;for(let y=0,M=T.length/3-1;y<M;y+=3){let R=y+0,E=y+1,C=y+2;h.push(R,E,E,C,C,R)}}else return;let m=new(xh(h)?vo:Mo)(h,1);m.version=g;let f=r.get(u);f&&e.remove(f),r.set(u,m)}function l(u){let h=r.get(u);if(h){let d=u.index;d!==null&&h.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:A,getWireframeAttribute:l}}function Bg(s,e,t){let n;function i(h){n=h}let r,o;function a(h){r=h.type,o=h.bytesPerElement}function A(h,d){s.drawElements(n,d,r,h*o),t.update(d,n,1)}function c(h,d,p){p!==0&&(s.drawElementsInstanced(n,d,r,h*o,p),t.update(d,n,p))}function l(h,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,h,0,p);let m=0;for(let f=0;f<p;f++)m+=d[f];t.update(m,n,1)}function u(h,d,p,g){if(p===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<h.length;f++)c(h[f]/o,d[f],g[f]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,h,0,g,0,p);let f=0;for(let T=0;T<p;T++)f+=d[T]*g[T];t.update(f,n,1)}}this.setMode=i,this.setIndex=a,this.render=A,this.renderInstances=c,this.renderMultiDraw=l,this.renderMultiDrawInstances=u}function Ug(s){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Zg(s,e,t){let n=new WeakMap,i=new Ke;function r(o,a,A){let c=o.morphTargetInfluences,l=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=l!==void 0?l.length:0,h=n.get(a);if(h===void 0||h.count!==u){let _=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",_)};h!==void 0&&h.texture.dispose();let d=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],T=a.morphAttributes.color||[],y=0;d===!0&&(y=1),p===!0&&(y=2),g===!0&&(y=3);let M=a.attributes.position.count*y,R=1;M>e.maxTextureSize&&(R=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let E=new Float32Array(M*R*4*u),C=new go(E,M,R,u);C.type=dn,C.needsUpdate=!0;let D=y*4;for(let x=0;x<u;x++){let S=m[x],V=f[x],B=T[x],F=M*R*4*x;for(let W=0;W<S.count;W++){let k=W*D;d===!0&&(i.fromBufferAttribute(S,W),E[F+k+0]=i.x,E[F+k+1]=i.y,E[F+k+2]=i.z,E[F+k+3]=0),p===!0&&(i.fromBufferAttribute(V,W),E[F+k+4]=i.x,E[F+k+5]=i.y,E[F+k+6]=i.z,E[F+k+7]=0),g===!0&&(i.fromBufferAttribute(B,W),E[F+k+8]=i.x,E[F+k+9]=i.y,E[F+k+10]=i.z,E[F+k+11]=B.itemSize===4?i.w:1)}}h={count:u,texture:C,size:new re(M,R)},n.set(a,h),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)A.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let d=0;for(let g=0;g<c.length;g++)d+=c[g];let p=a.morphTargetsRelative?1:1-d;A.getUniforms().setValue(s,"morphTargetBaseInfluence",p),A.getUniforms().setValue(s,"morphTargetInfluences",c)}A.getUniforms().setValue(s,"morphTargetsTexture",h.texture,t),A.getUniforms().setValue(s,"morphTargetsTextureSize",h.size)}return{update:r}}function Fg(s,e,t,n){let i=new WeakMap;function r(A){let c=n.render.frame,l=A.geometry,u=e.get(A,l);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),A.isInstancedMesh&&(A.hasEventListener("dispose",a)===!1&&A.addEventListener("dispose",a),i.get(A)!==c&&(t.update(A.instanceMatrix,s.ARRAY_BUFFER),A.instanceColor!==null&&t.update(A.instanceColor,s.ARRAY_BUFFER),i.set(A,c))),A.isSkinnedMesh){let h=A.skeleton;i.get(h)!==c&&(h.update(),i.set(h,c))}return u}function o(){i=new WeakMap}function a(A){let c=A.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var _o=class extends It{constructor(e,t,n,i,r,o,a,A,c,l=ls){if(l!==ls&&l!==gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&l===ls&&(n=Li),n===void 0&&l===gs&&(n=ms),super(null,i,r,o,a,A,l,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:St,this.minFilter=A!==void 0?A:St,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Th=new It,pu=new _o(1,1),Ih=new go,Ph=new kA,bh=new wo,mu=[],gu=[],Mu=new Float32Array(16),vu=new Float32Array(9),xu=new Float32Array(4);function bs(s,e,t){let n=s[0];if(n<=0||n>0)return s;let i=e*t,r=mu[i];if(r===void 0&&(r=new Float32Array(i),mu[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function xt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function wt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function $o(s,e){let t=gu[e];t===void 0&&(t=new Int32Array(e),gu[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function kg(s,e){let t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Vg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;s.uniform2fv(this.addr,e),wt(t,e)}}function Hg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(xt(t,e))return;s.uniform3fv(this.addr,e),wt(t,e)}}function jg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;s.uniform4fv(this.addr,e),wt(t,e)}}function Xg(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(xt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(xt(t,n))return;xu.set(n),s.uniformMatrix2fv(this.addr,!1,xu),wt(t,n)}}function Gg(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(xt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(xt(t,n))return;vu.set(n),s.uniformMatrix3fv(this.addr,!1,vu),wt(t,n)}}function Yg(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(xt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(xt(t,n))return;Mu.set(n),s.uniformMatrix4fv(this.addr,!1,Mu),wt(t,n)}}function Wg(s,e){let t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Qg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;s.uniform2iv(this.addr,e),wt(t,e)}}function Jg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;s.uniform3iv(this.addr,e),wt(t,e)}}function qg(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;s.uniform4iv(this.addr,e),wt(t,e)}}function Kg(s,e){let t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function $g(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;s.uniform2uiv(this.addr,e),wt(t,e)}}function eM(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;s.uniform3uiv(this.addr,e),wt(t,e)}}function tM(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;s.uniform4uiv(this.addr,e),wt(t,e)}}function nM(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(pu.compareFunction=Mh,r=pu):r=Th,t.setTexture2D(e||r,i)}function iM(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Ph,i)}function sM(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||bh,i)}function rM(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Ih,i)}function oM(s){switch(s){case 5126:return kg;case 35664:return Vg;case 35665:return Hg;case 35666:return jg;case 35674:return Xg;case 35675:return Gg;case 35676:return Yg;case 5124:case 35670:return Wg;case 35667:case 35671:return Qg;case 35668:case 35672:return Jg;case 35669:case 35673:return qg;case 5125:return Kg;case 36294:return $g;case 36295:return eM;case 36296:return tM;case 35678:case 36198:case 36298:case 36306:case 35682:return nM;case 35679:case 36299:case 36307:return iM;case 35680:case 36300:case 36308:case 36293:return sM;case 36289:case 36303:case 36311:case 36292:return rM}}function aM(s,e){s.uniform1fv(this.addr,e)}function AM(s,e){let t=bs(e,this.size,2);s.uniform2fv(this.addr,t)}function cM(s,e){let t=bs(e,this.size,3);s.uniform3fv(this.addr,t)}function lM(s,e){let t=bs(e,this.size,4);s.uniform4fv(this.addr,t)}function uM(s,e){let t=bs(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function hM(s,e){let t=bs(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function dM(s,e){let t=bs(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function fM(s,e){s.uniform1iv(this.addr,e)}function pM(s,e){s.uniform2iv(this.addr,e)}function mM(s,e){s.uniform3iv(this.addr,e)}function gM(s,e){s.uniform4iv(this.addr,e)}function MM(s,e){s.uniform1uiv(this.addr,e)}function vM(s,e){s.uniform2uiv(this.addr,e)}function xM(s,e){s.uniform3uiv(this.addr,e)}function wM(s,e){s.uniform4uiv(this.addr,e)}function yM(s,e,t){let n=this.cache,i=e.length,r=$o(t,i);xt(n,r)||(s.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||Th,r[o])}function _M(s,e,t){let n=this.cache,i=e.length,r=$o(t,i);xt(n,r)||(s.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||Ph,r[o])}function TM(s,e,t){let n=this.cache,i=e.length,r=$o(t,i);xt(n,r)||(s.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||bh,r[o])}function IM(s,e,t){let n=this.cache,i=e.length,r=$o(t,i);xt(n,r)||(s.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||Ih,r[o])}function PM(s){switch(s){case 5126:return aM;case 35664:return AM;case 35665:return cM;case 35666:return lM;case 35674:return uM;case 35675:return hM;case 35676:return dM;case 5124:case 35670:return fM;case 35667:case 35671:return pM;case 35668:case 35672:return mM;case 35669:case 35673:return gM;case 5125:return MM;case 36294:return vM;case 36295:return xM;case 36296:return wM;case 35678:case 36198:case 36298:case 36306:case 35682:return yM;case 35679:case 36299:case 36307:return _M;case 35680:case 36300:case 36308:case 36293:return TM;case 36289:case 36303:case 36311:case 36292:return IM}}var jA=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=oM(t.type)}},XA=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=PM(t.type)}},GA=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(e,t[a.id],n)}}},Ga=/(\w+)(\])?(\[|\.)?/g;function wu(s,e){s.seq.push(e),s.map[e.id]=e}function bM(s,e,t){let n=s.name,i=n.length;for(Ga.lastIndex=0;;){let r=Ga.exec(n),o=Ga.lastIndex,a=r[1],A=r[2]==="]",c=r[3];if(A&&(a=a|0),c===void 0||c==="["&&o+2===i){wu(t,c===void 0?new jA(a,s,e):new XA(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new GA(a),wu(t,u)),t=u}}}var hs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);bM(r,o,this)}}setValue(e,t,n,i){let r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){let a=t[r],A=n[a.id];A.needsUpdate!==!1&&a.setValue(e,A.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,r=e.length;i!==r;++i){let o=e[i];o.id in t&&n.push(o)}return n}};function yu(s,e,t){let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}var EM=37297,CM=0;function SM(s,e){let t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var _u=new Fe;function DM(s){Xe._getMatrix(_u,Xe.workingColorSpace,s);let e=`mat3( ${_u.elements.map(t=>t.toFixed(4))} )`;switch(Xe.getTransfer(s)){case Ko:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Tu(s,e,t){let n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";let r=/ERROR: 0:(\d+)/.exec(i);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+SM(s.getShaderSource(e),o)}else return i}function LM(s,e){let t=DM(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function RM(s,e){let t;switch(e){case kd:t="Linear";break;case Vd:t="Reinhard";break;case Hd:t="Cineon";break;case Ic:t="ACESFilmic";break;case Xd:t="AgX";break;case Gd:t="Neutral";break;case jd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var qr=new b;function zM(){Xe.getLuminanceCoefficients(qr);let s=qr.x.toFixed(4),e=qr.y.toFixed(4),t=qr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function NM(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ws).join(`
`)}function OM(s){let e=[];for(let t in s){let n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function BM(s,e){let t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(e,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function Ws(s){return s!==""}function Iu(s,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Pu(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var UM=/^[ \t]*#include +<([\w\d./]+)>/gm;function YA(s){return s.replace(UM,FM)}var ZM=new Map;function FM(s,e){let t=Ve[e];if(t===void 0){let n=ZM.get(e);if(n!==void 0)t=Ve[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return YA(t)}var kM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bu(s){return s.replace(kM,VM)}function VM(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Eu(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function HM(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===sh?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Tc?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Rn&&(e="SHADOWMAP_TYPE_VSM"),e}function jM(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case fs:case ps:e="ENVMAP_TYPE_CUBE";break;case Jo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function XM(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case ps:e="ENVMAP_MODE_REFRACTION";break}return e}function GM(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case rh:e="ENVMAP_BLENDING_MULTIPLY";break;case Zd:e="ENVMAP_BLENDING_MIX";break;case Fd:e="ENVMAP_BLENDING_ADD";break}return e}function YM(s){let e=s.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function WM(s,e,t,n){let i=s.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,A=HM(t),c=jM(t),l=XM(t),u=GM(t),h=YM(t),d=NM(t),p=OM(r),g=i.createProgram(),m,f,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Ws).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Ws).join(`
`),f.length>0&&(f+=`
`)):(m=[Eu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+A:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ws).join(`
`),f=[Eu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+A:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ai?"#define TONE_MAPPING":"",t.toneMapping!==Ai?Ve.tonemapping_pars_fragment:"",t.toneMapping!==Ai?RM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,LM("linearToOutputTexel",t.outputColorSpace),zM(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ws).join(`
`)),o=YA(o),o=Iu(o,t),o=Pu(o,t),a=YA(a),a=Iu(a,t),a=Pu(a,t),o=bu(o),a=bu(a),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===kl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===kl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let y=T+m+o,M=T+f+a,R=yu(i,i.VERTEX_SHADER,y),E=yu(i,i.FRAGMENT_SHADER,M);i.attachShader(g,R),i.attachShader(g,E),t.index0AttributeName!==void 0?i.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function C(S){if(s.debug.checkShaderErrors){let V=i.getProgramInfoLog(g).trim(),B=i.getShaderInfoLog(R).trim(),F=i.getShaderInfoLog(E).trim(),W=!0,k=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(W=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,R,E);else{let ee=Tu(i,R,"vertex"),H=Tu(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+V+`
`+ee+`
`+H)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(B===""||F==="")&&(k=!1);k&&(S.diagnostics={runnable:W,programLog:V,vertexShader:{log:B,prefix:m},fragmentShader:{log:F,prefix:f}})}i.deleteShader(R),i.deleteShader(E),D=new hs(i,g),_=BM(i,g)}let D;this.getUniforms=function(){return D===void 0&&C(this),D};let _;this.getAttributes=function(){return _===void 0&&C(this),_};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=i.getProgramParameter(g,EM)),x},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=CM++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=R,this.fragmentShader=E,this}var QM=0,WA=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new QA(e),t.set(e,n)),n}},QA=class{constructor(e){this.id=QM++,this.code=e,this.usedTimes=0}};function JM(s,e,t,n,i,r,o){let a=new rr,A=new WA,c=new Set,l=[],u=i.logarithmicDepthBuffer,h=i.vertexTextures,d=i.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return c.add(_),_===0?"uv":`uv${_}`}function m(_,x,S,V,B){let F=V.fog,W=B.geometry,k=_.isMeshStandardMaterial?V.environment:null,ee=(_.isMeshStandardMaterial?t:e).get(_.envMap||k),H=ee&&ee.mapping===Jo?ee.image.height:null,ae=p[_.type];_.precision!==null&&(d=i.getMaxPrecision(_.precision),d!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));let fe=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,xe=fe!==void 0?fe.length:0,Be=0;W.morphAttributes.position!==void 0&&(Be=1),W.morphAttributes.normal!==void 0&&(Be=2),W.morphAttributes.color!==void 0&&(Be=3);let $e,Y,ne,we;if(ae){let nt=mn[ae];$e=nt.vertexShader,Y=nt.fragmentShader}else $e=_.vertexShader,Y=_.fragmentShader,A.update(_),ne=A.getVertexShaderID(_),we=A.getFragmentShaderID(_);let se=s.getRenderTarget(),Ee=s.state.buffers.depth.getReversed(),Ne=B.isInstancedMesh===!0,De=B.isBatchedMesh===!0,We=!!_.map,J=!!_.matcap,te=!!ee,P=!!_.aoMap,Pe=!!_.lightMap,K=!!_.bumpMap,ge=!!_.normalMap,oe=!!_.displacementMap,Ce=!!_.emissiveMap,pe=!!_.metalnessMap,I=!!_.roughnessMap,v=_.anisotropy>0,O=_.clearcoat>0,X=_.dispersion>0,q=_.iridescence>0,G=_.sheen>0,ye=_.transmission>0,ce=v&&!!_.anisotropyMap,me=O&&!!_.clearcoatMap,je=O&&!!_.clearcoatNormalMap,$=O&&!!_.clearcoatRoughnessMap,Me=q&&!!_.iridescenceMap,Se=q&&!!_.iridescenceThicknessMap,ze=G&&!!_.sheenColorMap,ve=G&&!!_.sheenRoughnessMap,Ge=!!_.specularMap,ke=!!_.specularColorMap,ct=!!_.specularIntensityMap,L=ye&&!!_.transmissionMap,le=ye&&!!_.thicknessMap,j=!!_.gradientMap,Q=!!_.alphaMap,de=_.alphaTest>0,ue=!!_.alphaHash,Ue=!!_.extensions,pt=Ai;_.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(pt=s.toneMapping);let bt={shaderID:ae,shaderType:_.type,shaderName:_.name,vertexShader:$e,fragmentShader:Y,defines:_.defines,customVertexShaderID:ne,customFragmentShaderID:we,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:De,batchingColor:De&&B._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&B.instanceColor!==null,instancingMorph:Ne&&B.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:se===null?s.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:Dt,alphaToCoverage:!!_.alphaToCoverage,map:We,matcap:J,envMap:te,envMapMode:te&&ee.mapping,envMapCubeUVHeight:H,aoMap:P,lightMap:Pe,bumpMap:K,normalMap:ge,displacementMap:h&&oe,emissiveMap:Ce,normalMapObjectSpace:ge&&_.normalMapType===Kd,normalMapTangentSpace:ge&&_.normalMapType===gh,metalnessMap:pe,roughnessMap:I,anisotropy:v,anisotropyMap:ce,clearcoat:O,clearcoatMap:me,clearcoatNormalMap:je,clearcoatRoughnessMap:$,dispersion:X,iridescence:q,iridescenceMap:Me,iridescenceThicknessMap:Se,sheen:G,sheenColorMap:ze,sheenRoughnessMap:ve,specularMap:Ge,specularColorMap:ke,specularIntensityMap:ct,transmission:ye,transmissionMap:L,thicknessMap:le,gradientMap:j,opaque:_.transparent===!1&&_.blending===cs&&_.alphaToCoverage===!1,alphaMap:Q,alphaTest:de,alphaHash:ue,combine:_.combine,mapUv:We&&g(_.map.channel),aoMapUv:P&&g(_.aoMap.channel),lightMapUv:Pe&&g(_.lightMap.channel),bumpMapUv:K&&g(_.bumpMap.channel),normalMapUv:ge&&g(_.normalMap.channel),displacementMapUv:oe&&g(_.displacementMap.channel),emissiveMapUv:Ce&&g(_.emissiveMap.channel),metalnessMapUv:pe&&g(_.metalnessMap.channel),roughnessMapUv:I&&g(_.roughnessMap.channel),anisotropyMapUv:ce&&g(_.anisotropyMap.channel),clearcoatMapUv:me&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:je&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:Se&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:ze&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:ve&&g(_.sheenRoughnessMap.channel),specularMapUv:Ge&&g(_.specularMap.channel),specularColorMapUv:ke&&g(_.specularColorMap.channel),specularIntensityMapUv:ct&&g(_.specularIntensityMap.channel),transmissionMapUv:L&&g(_.transmissionMap.channel),thicknessMapUv:le&&g(_.thicknessMap.channel),alphaMapUv:Q&&g(_.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ge||v),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!W.attributes.uv&&(We||Q),fog:!!F,useFog:_.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Ee,skinning:B.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:Be,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&S.length>0,shadowMapType:s.shadowMap.type,toneMapping:pt,decodeVideoTexture:We&&_.map.isVideoTexture===!0&&Xe.getTransfer(_.map.colorSpace)===rt,decodeVideoTextureEmissive:Ce&&_.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(_.emissiveMap.colorSpace)===rt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Bt,flipSided:_.side===Zt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Ue&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ue&&_.extensions.multiDraw===!0||De)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return bt.vertexUv1s=c.has(1),bt.vertexUv2s=c.has(2),bt.vertexUv3s=c.has(3),c.clear(),bt}function f(_){let x=[];if(_.shaderID?x.push(_.shaderID):(x.push(_.customVertexShaderID),x.push(_.customFragmentShaderID)),_.defines!==void 0)for(let S in _.defines)x.push(S),x.push(_.defines[S]);return _.isRawShaderMaterial===!1&&(T(x,_),y(x,_),x.push(s.outputColorSpace)),x.push(_.customProgramCacheKey),x.join()}function T(_,x){_.push(x.precision),_.push(x.outputColorSpace),_.push(x.envMapMode),_.push(x.envMapCubeUVHeight),_.push(x.mapUv),_.push(x.alphaMapUv),_.push(x.lightMapUv),_.push(x.aoMapUv),_.push(x.bumpMapUv),_.push(x.normalMapUv),_.push(x.displacementMapUv),_.push(x.emissiveMapUv),_.push(x.metalnessMapUv),_.push(x.roughnessMapUv),_.push(x.anisotropyMapUv),_.push(x.clearcoatMapUv),_.push(x.clearcoatNormalMapUv),_.push(x.clearcoatRoughnessMapUv),_.push(x.iridescenceMapUv),_.push(x.iridescenceThicknessMapUv),_.push(x.sheenColorMapUv),_.push(x.sheenRoughnessMapUv),_.push(x.specularMapUv),_.push(x.specularColorMapUv),_.push(x.specularIntensityMapUv),_.push(x.transmissionMapUv),_.push(x.thicknessMapUv),_.push(x.combine),_.push(x.fogExp2),_.push(x.sizeAttenuation),_.push(x.morphTargetsCount),_.push(x.morphAttributeCount),_.push(x.numDirLights),_.push(x.numPointLights),_.push(x.numSpotLights),_.push(x.numSpotLightMaps),_.push(x.numHemiLights),_.push(x.numRectAreaLights),_.push(x.numDirLightShadows),_.push(x.numPointLightShadows),_.push(x.numSpotLightShadows),_.push(x.numSpotLightShadowsWithMaps),_.push(x.numLightProbes),_.push(x.shadowMapType),_.push(x.toneMapping),_.push(x.numClippingPlanes),_.push(x.numClipIntersection),_.push(x.depthPacking)}function y(_,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),_.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reverseDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),_.push(a.mask)}function M(_){let x=p[_.type],S;if(x){let V=mn[x];S=Ff.clone(V.uniforms)}else S=_.uniforms;return S}function R(_,x){let S;for(let V=0,B=l.length;V<B;V++){let F=l[V];if(F.cacheKey===x){S=F,++S.usedTimes;break}}return S===void 0&&(S=new WM(s,x,_,r),l.push(S)),S}function E(_){if(--_.usedTimes===0){let x=l.indexOf(_);l[x]=l[l.length-1],l.pop(),_.destroy()}}function C(_){A.remove(_)}function D(){A.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:R,releaseProgram:E,releaseShaderCache:C,programs:l,dispose:D}}function qM(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,A){s.get(o)[a]=A}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function KM(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Cu(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Su(){let s=[],e=0,t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(u,h,d,p,g,m){let f=s[e];return f===void 0?(f={id:u.id,object:u,geometry:h,material:d,groupOrder:p,renderOrder:u.renderOrder,z:g,group:m},s[e]=f):(f.id=u.id,f.object=u,f.geometry=h,f.material=d,f.groupOrder=p,f.renderOrder=u.renderOrder,f.z=g,f.group=m),e++,f}function a(u,h,d,p,g,m){let f=o(u,h,d,p,g,m);d.transmission>0?n.push(f):d.transparent===!0?i.push(f):t.push(f)}function A(u,h,d,p,g,m){let f=o(u,h,d,p,g,m);d.transmission>0?n.unshift(f):d.transparent===!0?i.unshift(f):t.unshift(f)}function c(u,h){t.length>1&&t.sort(u||KM),n.length>1&&n.sort(h||Cu),i.length>1&&i.sort(h||Cu)}function l(){for(let u=e,h=s.length;u<h;u++){let d=s[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:a,unshift:A,finish:l,sort:c}}function $M(){let s=new WeakMap;function e(n,i){let r=s.get(n),o;return r===void 0?(o=new Su,s.set(n,[o])):i>=r.length?(o=new Su,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function e0(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new b,color:new Le};break;case"SpotLight":t={position:new b,direction:new b,color:new Le,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new b,color:new Le,distance:0,decay:0};break;case"HemisphereLight":t={direction:new b,skyColor:new Le,groundColor:new Le};break;case"RectAreaLight":t={color:new Le,position:new b,halfWidth:new b,halfHeight:new b};break}return s[e.id]=t,t}}}function t0(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new re,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}var n0=0;function i0(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function s0(s){let e=new e0,t=t0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new b);let i=new b,r=new Re,o=new Re;function a(c){let l=0,u=0,h=0;for(let _=0;_<9;_++)n.probe[_].set(0,0,0);let d=0,p=0,g=0,m=0,f=0,T=0,y=0,M=0,R=0,E=0,C=0;c.sort(i0);for(let _=0,x=c.length;_<x;_++){let S=c[_],V=S.color,B=S.intensity,F=S.distance,W=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)l+=V.r*B,u+=V.g*B,h+=V.b*B;else if(S.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(S.sh.coefficients[k],B);C++}else if(S.isDirectionalLight){let k=e.get(S);if(k.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let ee=S.shadow,H=t.get(S);H.shadowIntensity=ee.intensity,H.shadowBias=ee.bias,H.shadowNormalBias=ee.normalBias,H.shadowRadius=ee.radius,H.shadowMapSize=ee.mapSize,n.directionalShadow[d]=H,n.directionalShadowMap[d]=W,n.directionalShadowMatrix[d]=S.shadow.matrix,T++}n.directional[d]=k,d++}else if(S.isSpotLight){let k=e.get(S);k.position.setFromMatrixPosition(S.matrixWorld),k.color.copy(V).multiplyScalar(B),k.distance=F,k.coneCos=Math.cos(S.angle),k.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),k.decay=S.decay,n.spot[g]=k;let ee=S.shadow;if(S.map&&(n.spotLightMap[R]=S.map,R++,ee.updateMatrices(S),S.castShadow&&E++),n.spotLightMatrix[g]=ee.matrix,S.castShadow){let H=t.get(S);H.shadowIntensity=ee.intensity,H.shadowBias=ee.bias,H.shadowNormalBias=ee.normalBias,H.shadowRadius=ee.radius,H.shadowMapSize=ee.mapSize,n.spotShadow[g]=H,n.spotShadowMap[g]=W,M++}g++}else if(S.isRectAreaLight){let k=e.get(S);k.color.copy(V).multiplyScalar(B),k.halfWidth.set(S.width*.5,0,0),k.halfHeight.set(0,S.height*.5,0),n.rectArea[m]=k,m++}else if(S.isPointLight){let k=e.get(S);if(k.color.copy(S.color).multiplyScalar(S.intensity),k.distance=S.distance,k.decay=S.decay,S.castShadow){let ee=S.shadow,H=t.get(S);H.shadowIntensity=ee.intensity,H.shadowBias=ee.bias,H.shadowNormalBias=ee.normalBias,H.shadowRadius=ee.radius,H.shadowMapSize=ee.mapSize,H.shadowCameraNear=ee.camera.near,H.shadowCameraFar=ee.camera.far,n.pointShadow[p]=H,n.pointShadowMap[p]=W,n.pointShadowMatrix[p]=S.shadow.matrix,y++}n.point[p]=k,p++}else if(S.isHemisphereLight){let k=e.get(S);k.skyColor.copy(S.color).multiplyScalar(B),k.groundColor.copy(S.groundColor).multiplyScalar(B),n.hemi[f]=k,f++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ae.LTC_FLOAT_1,n.rectAreaLTC2=Ae.LTC_FLOAT_2):(n.rectAreaLTC1=Ae.LTC_HALF_1,n.rectAreaLTC2=Ae.LTC_HALF_2)),n.ambient[0]=l,n.ambient[1]=u,n.ambient[2]=h;let D=n.hash;(D.directionalLength!==d||D.pointLength!==p||D.spotLength!==g||D.rectAreaLength!==m||D.hemiLength!==f||D.numDirectionalShadows!==T||D.numPointShadows!==y||D.numSpotShadows!==M||D.numSpotMaps!==R||D.numLightProbes!==C)&&(n.directional.length=d,n.spot.length=g,n.rectArea.length=m,n.point.length=p,n.hemi.length=f,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=M+R-E,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,D.directionalLength=d,D.pointLength=p,D.spotLength=g,D.rectAreaLength=m,D.hemiLength=f,D.numDirectionalShadows=T,D.numPointShadows=y,D.numSpotShadows=M,D.numSpotMaps=R,D.numLightProbes=C,n.version=n0++)}function A(c,l){let u=0,h=0,d=0,p=0,g=0,m=l.matrixWorldInverse;for(let f=0,T=c.length;f<T;f++){let y=c[f];if(y.isDirectionalLight){let M=n.directional[u];M.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),u++}else if(y.isSpotLight){let M=n.spot[d];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),d++}else if(y.isRectAreaLight){let M=n.rectArea[p];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),p++}else if(y.isPointLight){let M=n.point[h];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),h++}else if(y.isHemisphereLight){let M=n.hemi[g];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(m),g++}}}return{setup:a,setupView:A,state:n}}function Du(s){let e=new s0(s),t=[],n=[];function i(l){c.camera=l,t.length=0,n.length=0}function r(l){t.push(l)}function o(l){n.push(l)}function a(){e.setup(t)}function A(l){e.setupView(t,l)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:A,pushLight:r,pushShadow:o}}function r0(s){let e=new WeakMap;function t(i,r=0){let o=e.get(i),a;return o===void 0?(a=new Du(s),e.set(i,[a])):r>=o.length?(a=new Du(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var JA=class extends Xt{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Jd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},qA=class extends Xt{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},o0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,a0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function A0(s,e,t){let n=new or,i=new re,r=new re,o=new Ke,a=new JA({depthPacking:qd}),A=new qA,c={},l=t.maxTextureSize,u={[Mn]:Zt,[Zt]:Mn,[Bt]:Bt},h=new xn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new re},radius:{value:4}},vertexShader:o0,fragmentShader:a0}),d=h.clone();d.defines.HORIZONTAL_PASS=1;let p=new Nt;p.setAttribute("position",new vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new At(p,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sh;let f=this.type;this.render=function(E,C,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;let _=s.getRenderTarget(),x=s.getActiveCubeFace(),S=s.getActiveMipmapLevel(),V=s.state;V.setBlending(ai),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let B=f!==Rn&&this.type===Rn,F=f===Rn&&this.type!==Rn;for(let W=0,k=E.length;W<k;W++){let ee=E[W],H=ee.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);let ae=H.getFrameExtents();if(i.multiply(ae),r.copy(H.mapSize),(i.x>l||i.y>l)&&(i.x>l&&(r.x=Math.floor(l/ae.x),i.x=r.x*ae.x,H.mapSize.x=r.x),i.y>l&&(r.y=Math.floor(l/ae.y),i.y=r.y*ae.y,H.mapSize.y=r.y)),H.map===null||B===!0||F===!0){let xe=this.type!==Rn?{minFilter:St,magFilter:St}:{};H.map!==null&&H.map.dispose(),H.map=new Fn(i.x,i.y,xe),H.map.texture.name=ee.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();let fe=H.getViewportCount();for(let xe=0;xe<fe;xe++){let Be=H.getViewport(xe);o.set(r.x*Be.x,r.y*Be.y,r.x*Be.z,r.y*Be.w),V.viewport(o),H.updateMatrices(ee,xe),n=H.getFrustum(),M(C,D,H.camera,ee,this.type)}H.isPointLightShadow!==!0&&this.type===Rn&&T(H,D),H.needsUpdate=!1}f=this.type,m.needsUpdate=!1,s.setRenderTarget(_,x,S)};function T(E,C){let D=e.update(g);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Fn(i.x,i.y)),h.uniforms.shadow_pass.value=E.map.texture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(C,null,D,h,g,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(C,null,D,d,g,null)}function y(E,C,D,_){let x=null,S=D.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(S!==void 0)x=S;else if(x=D.isPointLight===!0?A:a,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){let V=x.uuid,B=C.uuid,F=c[V];F===void 0&&(F={},c[V]=F);let W=F[B];W===void 0&&(W=x.clone(),F[B]=W,C.addEventListener("dispose",R)),x=W}if(x.visible=C.visible,x.wireframe=C.wireframe,_===Rn?x.side=C.shadowSide!==null?C.shadowSide:C.side:x.side=C.shadowSide!==null?C.shadowSide:u[C.side],x.alphaMap=C.alphaMap,x.alphaTest=C.alphaTest,x.map=C.map,x.clipShadows=C.clipShadows,x.clippingPlanes=C.clippingPlanes,x.clipIntersection=C.clipIntersection,x.displacementMap=C.displacementMap,x.displacementScale=C.displacementScale,x.displacementBias=C.displacementBias,x.wireframeLinewidth=C.wireframeLinewidth,x.linewidth=C.linewidth,D.isPointLight===!0&&x.isMeshDistanceMaterial===!0){let V=s.properties.get(x);V.light=D}return x}function M(E,C,D,_,x){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&x===Rn)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,E.matrixWorld);let B=e.update(E),F=E.material;if(Array.isArray(F)){let W=B.groups;for(let k=0,ee=W.length;k<ee;k++){let H=W[k],ae=F[H.materialIndex];if(ae&&ae.visible){let fe=y(E,ae,_,x);E.onBeforeShadow(s,E,C,D,B,fe,H),s.renderBufferDirect(D,null,B,fe,E,H),E.onAfterShadow(s,E,C,D,B,fe,H)}}}else if(F.visible){let W=y(E,F,_,x);E.onBeforeShadow(s,E,C,D,B,W,null),s.renderBufferDirect(D,null,B,W,E,null),E.onAfterShadow(s,E,C,D,B,W,null)}}let V=E.children;for(let B=0,F=V.length;B<F;B++)M(V[B],C,D,_,x)}function R(E){E.target.removeEventListener("dispose",R);for(let D in c){let _=c[D],x=E.target.uuid;x in _&&(_[x].dispose(),delete _[x])}}}var c0={[iA]:sA,[rA]:AA,[oA]:cA,[ds]:aA,[sA]:iA,[AA]:rA,[cA]:oA,[aA]:ds};function l0(s,e){function t(){let L=!1,le=new Ke,j=null,Q=new Ke(0,0,0,0);return{setMask:function(de){j!==de&&!L&&(s.colorMask(de,de,de,de),j=de)},setLocked:function(de){L=de},setClear:function(de,ue,Ue,pt,bt){bt===!0&&(de*=pt,ue*=pt,Ue*=pt),le.set(de,ue,Ue,pt),Q.equals(le)===!1&&(s.clearColor(de,ue,Ue,pt),Q.copy(le))},reset:function(){L=!1,j=null,Q.set(-1,0,0,0)}}}function n(){let L=!1,le=!1,j=null,Q=null,de=null;return{setReversed:function(ue){if(le!==ue){let Ue=e.get("EXT_clip_control");le?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT);let pt=de;de=null,this.setClear(pt)}le=ue},getReversed:function(){return le},setTest:function(ue){ue?se(s.DEPTH_TEST):Ee(s.DEPTH_TEST)},setMask:function(ue){j!==ue&&!L&&(s.depthMask(ue),j=ue)},setFunc:function(ue){if(le&&(ue=c0[ue]),Q!==ue){switch(ue){case iA:s.depthFunc(s.NEVER);break;case sA:s.depthFunc(s.ALWAYS);break;case rA:s.depthFunc(s.LESS);break;case ds:s.depthFunc(s.LEQUAL);break;case oA:s.depthFunc(s.EQUAL);break;case aA:s.depthFunc(s.GEQUAL);break;case AA:s.depthFunc(s.GREATER);break;case cA:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Q=ue}},setLocked:function(ue){L=ue},setClear:function(ue){de!==ue&&(le&&(ue=1-ue),s.clearDepth(ue),de=ue)},reset:function(){L=!1,j=null,Q=null,de=null,le=!1}}}function i(){let L=!1,le=null,j=null,Q=null,de=null,ue=null,Ue=null,pt=null,bt=null;return{setTest:function(nt){L||(nt?se(s.STENCIL_TEST):Ee(s.STENCIL_TEST))},setMask:function(nt){le!==nt&&!L&&(s.stencilMask(nt),le=nt)},setFunc:function(nt,an,In){(j!==nt||Q!==an||de!==In)&&(s.stencilFunc(nt,an,In),j=nt,Q=an,de=In)},setOp:function(nt,an,In){(ue!==nt||Ue!==an||pt!==In)&&(s.stencilOp(nt,an,In),ue=nt,Ue=an,pt=In)},setLocked:function(nt){L=nt},setClear:function(nt){bt!==nt&&(s.clearStencil(nt),bt=nt)},reset:function(){L=!1,le=null,j=null,Q=null,de=null,ue=null,Ue=null,pt=null,bt=null}}}let r=new t,o=new n,a=new i,A=new WeakMap,c=new WeakMap,l={},u={},h=new WeakMap,d=[],p=null,g=!1,m=null,f=null,T=null,y=null,M=null,R=null,E=null,C=new Le(0,0,0),D=0,_=!1,x=null,S=null,V=null,B=null,F=null,W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,ee=0,H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(H)[1]),k=ee>=1):H.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),k=ee>=2);let ae=null,fe={},xe=s.getParameter(s.SCISSOR_BOX),Be=s.getParameter(s.VIEWPORT),$e=new Ke().fromArray(xe),Y=new Ke().fromArray(Be);function ne(L,le,j,Q){let de=new Uint8Array(4),ue=s.createTexture();s.bindTexture(L,ue),s.texParameteri(L,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(L,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ue=0;Ue<j;Ue++)L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY?s.texImage3D(le,0,s.RGBA,1,1,Q,0,s.RGBA,s.UNSIGNED_BYTE,de):s.texImage2D(le+Ue,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,de);return ue}let we={};we[s.TEXTURE_2D]=ne(s.TEXTURE_2D,s.TEXTURE_2D,1),we[s.TEXTURE_CUBE_MAP]=ne(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),we[s.TEXTURE_2D_ARRAY]=ne(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),we[s.TEXTURE_3D]=ne(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),se(s.DEPTH_TEST),o.setFunc(ds),K(!1),ge(Nl),se(s.CULL_FACE),P(ai);function se(L){l[L]!==!0&&(s.enable(L),l[L]=!0)}function Ee(L){l[L]!==!1&&(s.disable(L),l[L]=!1)}function Ne(L,le){return u[L]!==le?(s.bindFramebuffer(L,le),u[L]=le,L===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=le),L===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=le),!0):!1}function De(L,le){let j=d,Q=!1;if(L){j=h.get(le),j===void 0&&(j=[],h.set(le,j));let de=L.textures;if(j.length!==de.length||j[0]!==s.COLOR_ATTACHMENT0){for(let ue=0,Ue=de.length;ue<Ue;ue++)j[ue]=s.COLOR_ATTACHMENT0+ue;j.length=de.length,Q=!0}}else j[0]!==s.BACK&&(j[0]=s.BACK,Q=!0);Q&&s.drawBuffers(j)}function We(L){return p!==L?(s.useProgram(L),p=L,!0):!1}let J={[Ei]:s.FUNC_ADD,[yd]:s.FUNC_SUBTRACT,[_d]:s.FUNC_REVERSE_SUBTRACT};J[Td]=s.MIN,J[Id]=s.MAX;let te={[Pd]:s.ZERO,[bd]:s.ONE,[Ed]:s.SRC_COLOR,[tA]:s.SRC_ALPHA,[zd]:s.SRC_ALPHA_SATURATE,[Ld]:s.DST_COLOR,[Sd]:s.DST_ALPHA,[Cd]:s.ONE_MINUS_SRC_COLOR,[nA]:s.ONE_MINUS_SRC_ALPHA,[Rd]:s.ONE_MINUS_DST_COLOR,[Dd]:s.ONE_MINUS_DST_ALPHA,[Nd]:s.CONSTANT_COLOR,[Od]:s.ONE_MINUS_CONSTANT_COLOR,[Bd]:s.CONSTANT_ALPHA,[Ud]:s.ONE_MINUS_CONSTANT_ALPHA};function P(L,le,j,Q,de,ue,Ue,pt,bt,nt){if(L===ai){g===!0&&(Ee(s.BLEND),g=!1);return}if(g===!1&&(se(s.BLEND),g=!0),L!==wd){if(L!==m||nt!==_){if((f!==Ei||M!==Ei)&&(s.blendEquation(s.FUNC_ADD),f=Ei,M=Ei),nt)switch(L){case cs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ol:s.blendFunc(s.ONE,s.ONE);break;case Bl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ul:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case cs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ol:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Bl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ul:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}T=null,y=null,R=null,E=null,C.set(0,0,0),D=0,m=L,_=nt}return}de=de||le,ue=ue||j,Ue=Ue||Q,(le!==f||de!==M)&&(s.blendEquationSeparate(J[le],J[de]),f=le,M=de),(j!==T||Q!==y||ue!==R||Ue!==E)&&(s.blendFuncSeparate(te[j],te[Q],te[ue],te[Ue]),T=j,y=Q,R=ue,E=Ue),(pt.equals(C)===!1||bt!==D)&&(s.blendColor(pt.r,pt.g,pt.b,bt),C.copy(pt),D=bt),m=L,_=!1}function Pe(L,le){L.side===Bt?Ee(s.CULL_FACE):se(s.CULL_FACE);let j=L.side===Zt;le&&(j=!j),K(j),L.blending===cs&&L.transparent===!1?P(ai):P(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),r.setMask(L.colorWrite);let Q=L.stencilWrite;a.setTest(Q),Q&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Ce(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?se(s.SAMPLE_ALPHA_TO_COVERAGE):Ee(s.SAMPLE_ALPHA_TO_COVERAGE)}function K(L){x!==L&&(L?s.frontFace(s.CW):s.frontFace(s.CCW),x=L)}function ge(L){L!==vd?(se(s.CULL_FACE),L!==S&&(L===Nl?s.cullFace(s.BACK):L===xd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ee(s.CULL_FACE),S=L}function oe(L){L!==V&&(k&&s.lineWidth(L),V=L)}function Ce(L,le,j){L?(se(s.POLYGON_OFFSET_FILL),(B!==le||F!==j)&&(s.polygonOffset(le,j),B=le,F=j)):Ee(s.POLYGON_OFFSET_FILL)}function pe(L){L?se(s.SCISSOR_TEST):Ee(s.SCISSOR_TEST)}function I(L){L===void 0&&(L=s.TEXTURE0+W-1),ae!==L&&(s.activeTexture(L),ae=L)}function v(L,le,j){j===void 0&&(ae===null?j=s.TEXTURE0+W-1:j=ae);let Q=fe[j];Q===void 0&&(Q={type:void 0,texture:void 0},fe[j]=Q),(Q.type!==L||Q.texture!==le)&&(ae!==j&&(s.activeTexture(j),ae=j),s.bindTexture(L,le||we[L]),Q.type=L,Q.texture=le)}function O(){let L=fe[ae];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function X(){try{s.compressedTexImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{s.compressedTexImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function G(){try{s.texSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ye(){try{s.texSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ce(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function me(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function je(){try{s.texStorage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function $(){try{s.texStorage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Me(){try{s.texImage2D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Se(){try{s.texImage3D.apply(s,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ze(L){$e.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),$e.copy(L))}function ve(L){Y.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),Y.copy(L))}function Ge(L,le){let j=c.get(le);j===void 0&&(j=new WeakMap,c.set(le,j));let Q=j.get(L);Q===void 0&&(Q=s.getUniformBlockIndex(le,L.name),j.set(L,Q))}function ke(L,le){let Q=c.get(le).get(L);A.get(le)!==Q&&(s.uniformBlockBinding(le,Q,L.__bindingPointIndex),A.set(le,Q))}function ct(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),l={},ae=null,fe={},u={},h=new WeakMap,d=[],p=null,g=!1,m=null,f=null,T=null,y=null,M=null,R=null,E=null,C=new Le(0,0,0),D=0,_=!1,x=null,S=null,V=null,B=null,F=null,$e.set(0,0,s.canvas.width,s.canvas.height),Y.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:se,disable:Ee,bindFramebuffer:Ne,drawBuffers:De,useProgram:We,setBlending:P,setMaterial:Pe,setFlipSided:K,setCullFace:ge,setLineWidth:oe,setPolygonOffset:Ce,setScissorTest:pe,activeTexture:I,bindTexture:v,unbindTexture:O,compressedTexImage2D:X,compressedTexImage3D:q,texImage2D:Me,texImage3D:Se,updateUBOMapping:Ge,uniformBlockBinding:ke,texStorage2D:je,texStorage3D:$,texSubImage2D:G,texSubImage3D:ye,compressedTexSubImage2D:ce,compressedTexSubImage3D:me,scissor:ze,viewport:ve,reset:ct}}function Lu(s,e,t,n){let i=u0(n);switch(t){case lh:return s*e;case hh:return s*e;case dh:return s*e*2;case Sc:return s*e/i.components*i.byteLength;case Dc:return s*e/i.components*i.byteLength;case fh:return s*e*2/i.components*i.byteLength;case Lc:return s*e*2/i.components*i.byteLength;case uh:return s*e*3/i.components*i.byteLength;case Jt:return s*e*4/i.components*i.byteLength;case Rc:return s*e*4/i.components*i.byteLength;case Ao:case co:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case lo:case uo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case dA:case pA:return Math.max(s,16)*Math.max(e,8)/4;case hA:case fA:return Math.max(s,8)*Math.max(e,8)/2;case mA:case gA:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case MA:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case vA:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case xA:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case wA:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case yA:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case _A:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case TA:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case IA:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case PA:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case bA:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case EA:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case CA:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case SA:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case DA:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case LA:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case ho:case RA:case zA:return Math.ceil(s/4)*Math.ceil(e/4)*16;case ph:case NA:return Math.ceil(s/4)*Math.ceil(e/4)*8;case OA:case BA:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function u0(s){switch(s){case Un:case ah:return{byteLength:1,components:1};case ir:case Ah:case wr:return{byteLength:2,components:1};case Ec:case Cc:return{byteLength:2,components:4};case Li:case bc:case dn:return{byteLength:4,components:1};case ch:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function h0(s,e,t,n,i,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,A=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new re,l=new WeakMap,u,h=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(I,v){return d?new OffscreenCanvas(I,v):sr("canvas")}function g(I,v,O){let X=1,q=pe(I);if((q.width>O||q.height>O)&&(X=O/Math.max(q.width,q.height)),X<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let G=Math.floor(X*q.width),ye=Math.floor(X*q.height);u===void 0&&(u=p(G,ye));let ce=v?p(G,ye):u;return ce.width=G,ce.height=ye,ce.getContext("2d").drawImage(I,0,0,G,ye),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+G+"x"+ye+")."),ce}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),I;return I}function m(I){return I.generateMipmaps}function f(I){s.generateMipmap(I)}function T(I){return I.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?s.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(I,v,O,X,q=!1){if(I!==null){if(s[I]!==void 0)return s[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let G=v;if(v===s.RED&&(O===s.FLOAT&&(G=s.R32F),O===s.HALF_FLOAT&&(G=s.R16F),O===s.UNSIGNED_BYTE&&(G=s.R8)),v===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(G=s.R8UI),O===s.UNSIGNED_SHORT&&(G=s.R16UI),O===s.UNSIGNED_INT&&(G=s.R32UI),O===s.BYTE&&(G=s.R8I),O===s.SHORT&&(G=s.R16I),O===s.INT&&(G=s.R32I)),v===s.RG&&(O===s.FLOAT&&(G=s.RG32F),O===s.HALF_FLOAT&&(G=s.RG16F),O===s.UNSIGNED_BYTE&&(G=s.RG8)),v===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(G=s.RG8UI),O===s.UNSIGNED_SHORT&&(G=s.RG16UI),O===s.UNSIGNED_INT&&(G=s.RG32UI),O===s.BYTE&&(G=s.RG8I),O===s.SHORT&&(G=s.RG16I),O===s.INT&&(G=s.RG32I)),v===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(G=s.RGB8UI),O===s.UNSIGNED_SHORT&&(G=s.RGB16UI),O===s.UNSIGNED_INT&&(G=s.RGB32UI),O===s.BYTE&&(G=s.RGB8I),O===s.SHORT&&(G=s.RGB16I),O===s.INT&&(G=s.RGB32I)),v===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(G=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(G=s.RGBA16UI),O===s.UNSIGNED_INT&&(G=s.RGBA32UI),O===s.BYTE&&(G=s.RGBA8I),O===s.SHORT&&(G=s.RGBA16I),O===s.INT&&(G=s.RGBA32I)),v===s.RGB&&O===s.UNSIGNED_INT_5_9_9_9_REV&&(G=s.RGB9_E5),v===s.RGBA){let ye=q?Ko:Xe.getTransfer(X);O===s.FLOAT&&(G=s.RGBA32F),O===s.HALF_FLOAT&&(G=s.RGBA16F),O===s.UNSIGNED_BYTE&&(G=ye===rt?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT_4_4_4_4&&(G=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(G=s.RGB5_A1)}return(G===s.R16F||G===s.R32F||G===s.RG16F||G===s.RG32F||G===s.RGBA16F||G===s.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function M(I,v){let O;return I?v===null||v===Li||v===ms?O=s.DEPTH24_STENCIL8:v===dn?O=s.DEPTH32F_STENCIL8:v===ir&&(O=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Li||v===ms?O=s.DEPTH_COMPONENT24:v===dn?O=s.DEPTH_COMPONENT32F:v===ir&&(O=s.DEPTH_COMPONENT16),O}function R(I,v){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==St&&I.minFilter!==Ut?Math.log2(Math.max(v.width,v.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?v.mipmaps.length:1}function E(I){let v=I.target;v.removeEventListener("dispose",E),D(v),v.isVideoTexture&&l.delete(v)}function C(I){let v=I.target;v.removeEventListener("dispose",C),x(v)}function D(I){let v=n.get(I);if(v.__webglInit===void 0)return;let O=I.source,X=h.get(O);if(X){let q=X[v.__cacheKey];q.usedTimes--,q.usedTimes===0&&_(I),Object.keys(X).length===0&&h.delete(O)}n.remove(I)}function _(I){let v=n.get(I);s.deleteTexture(v.__webglTexture);let O=I.source,X=h.get(O);delete X[v.__cacheKey],o.memory.textures--}function x(I){let v=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(v.__webglFramebuffer[X]))for(let q=0;q<v.__webglFramebuffer[X].length;q++)s.deleteFramebuffer(v.__webglFramebuffer[X][q]);else s.deleteFramebuffer(v.__webglFramebuffer[X]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[X])}else{if(Array.isArray(v.__webglFramebuffer))for(let X=0;X<v.__webglFramebuffer.length;X++)s.deleteFramebuffer(v.__webglFramebuffer[X]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let X=0;X<v.__webglColorRenderbuffer.length;X++)v.__webglColorRenderbuffer[X]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[X]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let O=I.textures;for(let X=0,q=O.length;X<q;X++){let G=n.get(O[X]);G.__webglTexture&&(s.deleteTexture(G.__webglTexture),o.memory.textures--),n.remove(O[X])}n.remove(I)}let S=0;function V(){S=0}function B(){let I=S;return I>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+i.maxTextures),S+=1,I}function F(I){let v=[];return v.push(I.wrapS),v.push(I.wrapT),v.push(I.wrapR||0),v.push(I.magFilter),v.push(I.minFilter),v.push(I.anisotropy),v.push(I.internalFormat),v.push(I.format),v.push(I.type),v.push(I.generateMipmaps),v.push(I.premultiplyAlpha),v.push(I.flipY),v.push(I.unpackAlignment),v.push(I.colorSpace),v.join()}function W(I,v){let O=n.get(I);if(I.isVideoTexture&&oe(I),I.isRenderTargetTexture===!1&&I.version>0&&O.__version!==I.version){let X=I.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(O,I,v);return}}t.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+v)}function k(I,v){let O=n.get(I);if(I.version>0&&O.__version!==I.version){Y(O,I,v);return}t.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+v)}function ee(I,v){let O=n.get(I);if(I.version>0&&O.__version!==I.version){Y(O,I,v);return}t.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+v)}function H(I,v){let O=n.get(I);if(I.version>0&&O.__version!==I.version){ne(O,I,v);return}t.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+v)}let ae={[Di]:s.REPEAT,[Nn]:s.CLAMP_TO_EDGE,[nr]:s.MIRRORED_REPEAT},fe={[St]:s.NEAREST,[Pc]:s.NEAREST_MIPMAP_NEAREST,[ss]:s.NEAREST_MIPMAP_LINEAR,[Ut]:s.LINEAR,[Qs]:s.LINEAR_MIPMAP_NEAREST,[gn]:s.LINEAR_MIPMAP_LINEAR},xe={[$d]:s.NEVER,[of]:s.ALWAYS,[ef]:s.LESS,[Mh]:s.LEQUAL,[tf]:s.EQUAL,[rf]:s.GEQUAL,[nf]:s.GREATER,[sf]:s.NOTEQUAL};function Be(I,v){if(v.type===dn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Ut||v.magFilter===Qs||v.magFilter===ss||v.magFilter===gn||v.minFilter===Ut||v.minFilter===Qs||v.minFilter===ss||v.minFilter===gn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(I,s.TEXTURE_WRAP_S,ae[v.wrapS]),s.texParameteri(I,s.TEXTURE_WRAP_T,ae[v.wrapT]),(I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY)&&s.texParameteri(I,s.TEXTURE_WRAP_R,ae[v.wrapR]),s.texParameteri(I,s.TEXTURE_MAG_FILTER,fe[v.magFilter]),s.texParameteri(I,s.TEXTURE_MIN_FILTER,fe[v.minFilter]),v.compareFunction&&(s.texParameteri(I,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(I,s.TEXTURE_COMPARE_FUNC,xe[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===St||v.minFilter!==ss&&v.minFilter!==gn||v.type===dn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");s.texParameterf(I,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function $e(I,v){let O=!1;I.__webglInit===void 0&&(I.__webglInit=!0,v.addEventListener("dispose",E));let X=v.source,q=h.get(X);q===void 0&&(q={},h.set(X,q));let G=F(v);if(G!==I.__cacheKey){q[G]===void 0&&(q[G]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,O=!0),q[G].usedTimes++;let ye=q[I.__cacheKey];ye!==void 0&&(q[I.__cacheKey].usedTimes--,ye.usedTimes===0&&_(v)),I.__cacheKey=G,I.__webglTexture=q[G].texture}return O}function Y(I,v,O){let X=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(X=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(X=s.TEXTURE_3D);let q=$e(I,v),G=v.source;t.bindTexture(X,I.__webglTexture,s.TEXTURE0+O);let ye=n.get(G);if(G.version!==ye.__version||q===!0){t.activeTexture(s.TEXTURE0+O);let ce=Xe.getPrimaries(Xe.workingColorSpace),me=v.colorSpace===ri?null:Xe.getPrimaries(v.colorSpace),je=v.colorSpace===ri||ce===me?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);let $=g(v.image,!1,i.maxTextureSize);$=Ce(v,$);let Me=r.convert(v.format,v.colorSpace),Se=r.convert(v.type),ze=y(v.internalFormat,Me,Se,v.colorSpace,v.isVideoTexture);Be(X,v);let ve,Ge=v.mipmaps,ke=v.isVideoTexture!==!0,ct=ye.__version===void 0||q===!0,L=G.dataReady,le=R(v,$);if(v.isDepthTexture)ze=M(v.format===gs,v.type),ct&&(ke?t.texStorage2D(s.TEXTURE_2D,1,ze,$.width,$.height):t.texImage2D(s.TEXTURE_2D,0,ze,$.width,$.height,0,Me,Se,null));else if(v.isDataTexture)if(Ge.length>0){ke&&ct&&t.texStorage2D(s.TEXTURE_2D,le,ze,Ge[0].width,Ge[0].height);for(let j=0,Q=Ge.length;j<Q;j++)ve=Ge[j],ke?L&&t.texSubImage2D(s.TEXTURE_2D,j,0,0,ve.width,ve.height,Me,Se,ve.data):t.texImage2D(s.TEXTURE_2D,j,ze,ve.width,ve.height,0,Me,Se,ve.data);v.generateMipmaps=!1}else ke?(ct&&t.texStorage2D(s.TEXTURE_2D,le,ze,$.width,$.height),L&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,$.width,$.height,Me,Se,$.data)):t.texImage2D(s.TEXTURE_2D,0,ze,$.width,$.height,0,Me,Se,$.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){ke&&ct&&t.texStorage3D(s.TEXTURE_2D_ARRAY,le,ze,Ge[0].width,Ge[0].height,$.depth);for(let j=0,Q=Ge.length;j<Q;j++)if(ve=Ge[j],v.format!==Jt)if(Me!==null)if(ke){if(L)if(v.layerUpdates.size>0){let de=Lu(ve.width,ve.height,v.format,v.type);for(let ue of v.layerUpdates){let Ue=ve.data.subarray(ue*de/ve.data.BYTES_PER_ELEMENT,(ue+1)*de/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,j,0,0,ue,ve.width,ve.height,1,Me,Ue)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,j,0,0,0,ve.width,ve.height,$.depth,Me,ve.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,j,ze,ve.width,ve.height,$.depth,0,ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?L&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,j,0,0,0,ve.width,ve.height,$.depth,Me,Se,ve.data):t.texImage3D(s.TEXTURE_2D_ARRAY,j,ze,ve.width,ve.height,$.depth,0,Me,Se,ve.data)}else{ke&&ct&&t.texStorage2D(s.TEXTURE_2D,le,ze,Ge[0].width,Ge[0].height);for(let j=0,Q=Ge.length;j<Q;j++)ve=Ge[j],v.format!==Jt?Me!==null?ke?L&&t.compressedTexSubImage2D(s.TEXTURE_2D,j,0,0,ve.width,ve.height,Me,ve.data):t.compressedTexImage2D(s.TEXTURE_2D,j,ze,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?L&&t.texSubImage2D(s.TEXTURE_2D,j,0,0,ve.width,ve.height,Me,Se,ve.data):t.texImage2D(s.TEXTURE_2D,j,ze,ve.width,ve.height,0,Me,Se,ve.data)}else if(v.isDataArrayTexture)if(ke){if(ct&&t.texStorage3D(s.TEXTURE_2D_ARRAY,le,ze,$.width,$.height,$.depth),L)if(v.layerUpdates.size>0){let j=Lu($.width,$.height,v.format,v.type);for(let Q of v.layerUpdates){let de=$.data.subarray(Q*j/$.data.BYTES_PER_ELEMENT,(Q+1)*j/$.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Q,$.width,$.height,1,Me,Se,de)}v.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,Me,Se,$.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ze,$.width,$.height,$.depth,0,Me,Se,$.data);else if(v.isData3DTexture)ke?(ct&&t.texStorage3D(s.TEXTURE_3D,le,ze,$.width,$.height,$.depth),L&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,Me,Se,$.data)):t.texImage3D(s.TEXTURE_3D,0,ze,$.width,$.height,$.depth,0,Me,Se,$.data);else if(v.isFramebufferTexture){if(ct)if(ke)t.texStorage2D(s.TEXTURE_2D,le,ze,$.width,$.height);else{let j=$.width,Q=$.height;for(let de=0;de<le;de++)t.texImage2D(s.TEXTURE_2D,de,ze,j,Q,0,Me,Se,null),j>>=1,Q>>=1}}else if(Ge.length>0){if(ke&&ct){let j=pe(Ge[0]);t.texStorage2D(s.TEXTURE_2D,le,ze,j.width,j.height)}for(let j=0,Q=Ge.length;j<Q;j++)ve=Ge[j],ke?L&&t.texSubImage2D(s.TEXTURE_2D,j,0,0,Me,Se,ve):t.texImage2D(s.TEXTURE_2D,j,ze,Me,Se,ve);v.generateMipmaps=!1}else if(ke){if(ct){let j=pe($);t.texStorage2D(s.TEXTURE_2D,le,ze,j.width,j.height)}L&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Me,Se,$)}else t.texImage2D(s.TEXTURE_2D,0,ze,Me,Se,$);m(v)&&f(X),ye.__version=G.version,v.onUpdate&&v.onUpdate(v)}I.__version=v.version}function ne(I,v,O){if(v.image.length!==6)return;let X=$e(I,v),q=v.source;t.bindTexture(s.TEXTURE_CUBE_MAP,I.__webglTexture,s.TEXTURE0+O);let G=n.get(q);if(q.version!==G.__version||X===!0){t.activeTexture(s.TEXTURE0+O);let ye=Xe.getPrimaries(Xe.workingColorSpace),ce=v.colorSpace===ri?null:Xe.getPrimaries(v.colorSpace),me=v.colorSpace===ri||ye===ce?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);let je=v.isCompressedTexture||v.image[0].isCompressedTexture,$=v.image[0]&&v.image[0].isDataTexture,Me=[];for(let Q=0;Q<6;Q++)!je&&!$?Me[Q]=g(v.image[Q],!0,i.maxCubemapSize):Me[Q]=$?v.image[Q].image:v.image[Q],Me[Q]=Ce(v,Me[Q]);let Se=Me[0],ze=r.convert(v.format,v.colorSpace),ve=r.convert(v.type),Ge=y(v.internalFormat,ze,ve,v.colorSpace),ke=v.isVideoTexture!==!0,ct=G.__version===void 0||X===!0,L=q.dataReady,le=R(v,Se);Be(s.TEXTURE_CUBE_MAP,v);let j;if(je){ke&&ct&&t.texStorage2D(s.TEXTURE_CUBE_MAP,le,Ge,Se.width,Se.height);for(let Q=0;Q<6;Q++){j=Me[Q].mipmaps;for(let de=0;de<j.length;de++){let ue=j[de];v.format!==Jt?ze!==null?ke?L&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,de,0,0,ue.width,ue.height,ze,ue.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,de,Ge,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ke?L&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,de,0,0,ue.width,ue.height,ze,ve,ue.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,de,Ge,ue.width,ue.height,0,ze,ve,ue.data)}}}else{if(j=v.mipmaps,ke&&ct){j.length>0&&le++;let Q=pe(Me[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,le,Ge,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if($){ke?L&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Me[Q].width,Me[Q].height,ze,ve,Me[Q].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ge,Me[Q].width,Me[Q].height,0,ze,ve,Me[Q].data);for(let de=0;de<j.length;de++){let Ue=j[de].image[Q].image;ke?L&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,de+1,0,0,Ue.width,Ue.height,ze,ve,Ue.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,de+1,Ge,Ue.width,Ue.height,0,ze,ve,Ue.data)}}else{ke?L&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ze,ve,Me[Q]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ge,ze,ve,Me[Q]);for(let de=0;de<j.length;de++){let ue=j[de];ke?L&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,de+1,0,0,ze,ve,ue.image[Q]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,de+1,Ge,ze,ve,ue.image[Q])}}}m(v)&&f(s.TEXTURE_CUBE_MAP),G.__version=q.version,v.onUpdate&&v.onUpdate(v)}I.__version=v.version}function we(I,v,O,X,q,G){let ye=r.convert(O.format,O.colorSpace),ce=r.convert(O.type),me=y(O.internalFormat,ye,ce,O.colorSpace),je=n.get(v),$=n.get(O);if($.__renderTarget=v,!je.__hasExternalTextures){let Me=Math.max(1,v.width>>G),Se=Math.max(1,v.height>>G);q===s.TEXTURE_3D||q===s.TEXTURE_2D_ARRAY?t.texImage3D(q,G,me,Me,Se,v.depth,0,ye,ce,null):t.texImage2D(q,G,me,Me,Se,0,ye,ce,null)}t.bindFramebuffer(s.FRAMEBUFFER,I),ge(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,X,q,$.__webglTexture,0,K(v)):(q===s.TEXTURE_2D||q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,X,q,$.__webglTexture,G),t.bindFramebuffer(s.FRAMEBUFFER,null)}function se(I,v,O){if(s.bindRenderbuffer(s.RENDERBUFFER,I),v.depthBuffer){let X=v.depthTexture,q=X&&X.isDepthTexture?X.type:null,G=M(v.stencilBuffer,q),ye=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ce=K(v);ge(v)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ce,G,v.width,v.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,ce,G,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,G,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ye,s.RENDERBUFFER,I)}else{let X=v.textures;for(let q=0;q<X.length;q++){let G=X[q],ye=r.convert(G.format,G.colorSpace),ce=r.convert(G.type),me=y(G.internalFormat,ye,ce,G.colorSpace),je=K(v);O&&ge(v)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,je,me,v.width,v.height):ge(v)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,je,me,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,me,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ee(I,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,I),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let X=n.get(v.depthTexture);X.__renderTarget=v,(!X.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),W(v.depthTexture,0);let q=X.__webglTexture,G=K(v);if(v.depthTexture.format===ls)ge(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,q,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,q,0);else if(v.depthTexture.format===gs)ge(v)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,q,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function Ne(I){let v=n.get(I),O=I.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==I.depthTexture){let X=I.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),X){let q=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,X.removeEventListener("dispose",q)};X.addEventListener("dispose",q),v.__depthDisposeCallback=q}v.__boundDepthTexture=X}if(I.depthTexture&&!v.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Ee(v.__webglFramebuffer,I)}else if(O){v.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[X]),v.__webglDepthbuffer[X]===void 0)v.__webglDepthbuffer[X]=s.createRenderbuffer(),se(v.__webglDepthbuffer[X],I,!1);else{let q=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer[X];s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,q,s.RENDERBUFFER,G)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),se(v.__webglDepthbuffer,I,!1);else{let X=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,q=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,q),s.framebufferRenderbuffer(s.FRAMEBUFFER,X,s.RENDERBUFFER,q)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function De(I,v,O){let X=n.get(I);v!==void 0&&we(X.__webglFramebuffer,I,I.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&Ne(I)}function We(I){let v=I.texture,O=n.get(I),X=n.get(v);I.addEventListener("dispose",C);let q=I.textures,G=I.isWebGLCubeRenderTarget===!0,ye=q.length>1;if(ye||(X.__webglTexture===void 0&&(X.__webglTexture=s.createTexture()),X.__version=v.version,o.memory.textures++),G){O.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[ce]=[];for(let me=0;me<v.mipmaps.length;me++)O.__webglFramebuffer[ce][me]=s.createFramebuffer()}else O.__webglFramebuffer[ce]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let ce=0;ce<v.mipmaps.length;ce++)O.__webglFramebuffer[ce]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(ye)for(let ce=0,me=q.length;ce<me;ce++){let je=n.get(q[ce]);je.__webglTexture===void 0&&(je.__webglTexture=s.createTexture(),o.memory.textures++)}if(I.samples>0&&ge(I)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ce=0;ce<q.length;ce++){let me=q[ce];O.__webglColorRenderbuffer[ce]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[ce]);let je=r.convert(me.format,me.colorSpace),$=r.convert(me.type),Me=y(me.internalFormat,je,$,me.colorSpace,I.isXRRenderTarget===!0),Se=K(I);s.renderbufferStorageMultisample(s.RENDERBUFFER,Se,Me,I.width,I.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ce,s.RENDERBUFFER,O.__webglColorRenderbuffer[ce])}s.bindRenderbuffer(s.RENDERBUFFER,null),I.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),se(O.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(G){t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture),Be(s.TEXTURE_CUBE_MAP,v);for(let ce=0;ce<6;ce++)if(v.mipmaps&&v.mipmaps.length>0)for(let me=0;me<v.mipmaps.length;me++)we(O.__webglFramebuffer[ce][me],I,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ce,me);else we(O.__webglFramebuffer[ce],I,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);m(v)&&f(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ye){for(let ce=0,me=q.length;ce<me;ce++){let je=q[ce],$=n.get(je);t.bindTexture(s.TEXTURE_2D,$.__webglTexture),Be(s.TEXTURE_2D,je),we(O.__webglFramebuffer,I,je,s.COLOR_ATTACHMENT0+ce,s.TEXTURE_2D,0),m(je)&&f(s.TEXTURE_2D)}t.unbindTexture()}else{let ce=s.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(ce=I.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ce,X.__webglTexture),Be(ce,v),v.mipmaps&&v.mipmaps.length>0)for(let me=0;me<v.mipmaps.length;me++)we(O.__webglFramebuffer[me],I,v,s.COLOR_ATTACHMENT0,ce,me);else we(O.__webglFramebuffer,I,v,s.COLOR_ATTACHMENT0,ce,0);m(v)&&f(ce),t.unbindTexture()}I.depthBuffer&&Ne(I)}function J(I){let v=I.textures;for(let O=0,X=v.length;O<X;O++){let q=v[O];if(m(q)){let G=T(I),ye=n.get(q).__webglTexture;t.bindTexture(G,ye),f(G),t.unbindTexture()}}}let te=[],P=[];function Pe(I){if(I.samples>0){if(ge(I)===!1){let v=I.textures,O=I.width,X=I.height,q=s.COLOR_BUFFER_BIT,G=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ye=n.get(I),ce=v.length>1;if(ce)for(let me=0;me<v.length;me++)t.bindFramebuffer(s.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ye.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let me=0;me<v.length;me++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(q|=s.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(q|=s.STENCIL_BUFFER_BIT)),ce){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ye.__webglColorRenderbuffer[me]);let je=n.get(v[me]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,je,0)}s.blitFramebuffer(0,0,O,X,0,0,O,X,q,s.NEAREST),A===!0&&(te.length=0,P.length=0,te.push(s.COLOR_ATTACHMENT0+me),I.depthBuffer&&I.resolveDepthBuffer===!1&&(te.push(G),P.push(G),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,P)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,te))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ce)for(let me=0;me<v.length;me++){t.bindFramebuffer(s.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.RENDERBUFFER,ye.__webglColorRenderbuffer[me]);let je=n.get(v[me]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ye.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+me,s.TEXTURE_2D,je,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&A){let v=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function K(I){return Math.min(i.maxSamples,I.samples)}function ge(I){let v=n.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function oe(I){let v=o.render.frame;l.get(I)!==v&&(l.set(I,v),I.update())}function Ce(I,v){let O=I.colorSpace,X=I.format,q=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||O!==Dt&&O!==ri&&(Xe.getTransfer(O)===rt?(X!==Jt||q!==Un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),v}function pe(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=V,this.setTexture2D=W,this.setTexture2DArray=k,this.setTexture3D=ee,this.setTextureCube=H,this.rebindTextures=De,this.setupRenderTarget=We,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=Pe,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=we,this.useMultisampledRTT=ge}function d0(s,e){function t(n,i=ri){let r,o=Xe.getTransfer(i);if(n===Un)return s.UNSIGNED_BYTE;if(n===Ec)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Cc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===ch)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===ah)return s.BYTE;if(n===Ah)return s.SHORT;if(n===ir)return s.UNSIGNED_SHORT;if(n===bc)return s.INT;if(n===Li)return s.UNSIGNED_INT;if(n===dn)return s.FLOAT;if(n===wr)return s.HALF_FLOAT;if(n===lh)return s.ALPHA;if(n===uh)return s.RGB;if(n===Jt)return s.RGBA;if(n===hh)return s.LUMINANCE;if(n===dh)return s.LUMINANCE_ALPHA;if(n===ls)return s.DEPTH_COMPONENT;if(n===gs)return s.DEPTH_STENCIL;if(n===Sc)return s.RED;if(n===Dc)return s.RED_INTEGER;if(n===fh)return s.RG;if(n===Lc)return s.RG_INTEGER;if(n===Rc)return s.RGBA_INTEGER;if(n===Ao||n===co||n===lo||n===uo)if(o===rt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ao)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===lo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===uo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ao)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===co)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===lo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===uo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===hA||n===dA||n===fA||n===pA)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===hA)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===dA)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===fA)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===pA)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===mA||n===gA||n===MA)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===mA||n===gA)return o===rt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===MA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===vA||n===xA||n===wA||n===yA||n===_A||n===TA||n===IA||n===PA||n===bA||n===EA||n===CA||n===SA||n===DA||n===LA)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===vA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===xA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===wA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===yA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===_A)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===TA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===IA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===PA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===bA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===EA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===CA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===SA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===DA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===LA)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ho||n===RA||n===zA)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ho)return o===rt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===RA)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===zA)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ph||n===NA||n===OA||n===BA)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ho)return r.COMPRESSED_RED_RGTC1_EXT;if(n===NA)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===OA)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===BA)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ms?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}var KA=class extends Tt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},zt=class extends dt{constructor(){super(),this.isGroup=!0,this.type="Group"}},f0={type:"move"},Ks=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new b,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new b),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new b,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new b),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null,a=this._targetRay,A=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let g of e.hand.values()){let m=t.getJointPose(g,n),f=this._getHandJoint(c,g);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let l=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=l.position.distanceTo(u.position),d=.02,p=.005;c.inputState.pinching&&h>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else A!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(A.matrix.fromArray(r.transform.matrix),A.matrix.decompose(A.position,A.rotation,A.scale),A.matrixWorldNeedsUpdate=!0,r.linearVelocity?(A.hasLinearVelocity=!0,A.linearVelocity.copy(r.linearVelocity)):A.hasLinearVelocity=!1,r.angularVelocity?(A.hasAngularVelocity=!0,A.angularVelocity.copy(r.angularVelocity)):A.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(f0)))}return a!==null&&(a.visible=i!==null),A!==null&&(A.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new zt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},p0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,m0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,$A=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let i=new It,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new xn({vertexShader:p0,fragmentShader:m0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new At(new Ni(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ec=class extends Zn{constructor(e,t){super();let n=this,i=null,r=1,o=null,a="local-floor",A=1,c=null,l=null,u=null,h=null,d=null,p=null,g=new $A,m=t.getContextAttributes(),f=null,T=null,y=[],M=[],R=new re,E=null,C=new Tt;C.viewport=new Ke;let D=new Tt;D.viewport=new Ke;let _=[C,D],x=new KA,S=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ne=y[Y];return ne===void 0&&(ne=new Ks,y[Y]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(Y){let ne=y[Y];return ne===void 0&&(ne=new Ks,y[Y]=ne),ne.getGripSpace()},this.getHand=function(Y){let ne=y[Y];return ne===void 0&&(ne=new Ks,y[Y]=ne),ne.getHandSpace()};function B(Y){let ne=M.indexOf(Y.inputSource);if(ne===-1)return;let we=y[ne];we!==void 0&&(we.update(Y.inputSource,Y.frame,c||o),we.dispatchEvent({type:Y.type,data:Y.inputSource}))}function F(){i.removeEventListener("select",B),i.removeEventListener("selectstart",B),i.removeEventListener("selectend",B),i.removeEventListener("squeeze",B),i.removeEventListener("squeezestart",B),i.removeEventListener("squeezeend",B),i.removeEventListener("end",F),i.removeEventListener("inputsourceschange",W);for(let Y=0;Y<y.length;Y++){let ne=M[Y];ne!==null&&(M[Y]=null,y[Y].disconnect(ne))}S=null,V=null,g.reset(),e.setRenderTarget(f),d=null,h=null,u=null,i=null,T=null,$e.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(f=e.getRenderTarget(),i.addEventListener("select",B),i.addEventListener("selectstart",B),i.addEventListener("selectend",B),i.addEventListener("squeeze",B),i.addEventListener("squeezestart",B),i.addEventListener("squeezeend",B),i.addEventListener("end",F),i.addEventListener("inputsourceschange",W),m.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(R),i.renderState.layers===void 0){let ne={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,ne),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),T=new Fn(d.framebufferWidth,d.framebufferHeight,{format:Jt,type:Un,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ne=null,we=null,se=null;m.depth&&(se=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ne=m.stencil?gs:ls,we=m.stencil?ms:Li);let Ee={colorFormat:t.RGBA8,depthFormat:se,scaleFactor:r};u=new XRWebGLBinding(i,t),h=u.createProjectionLayer(Ee),i.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),T=new Fn(h.textureWidth,h.textureHeight,{format:Jt,type:Un,depthTexture:new _o(h.textureWidth,h.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(A),c=null,o=await i.requestReferenceSpace(a),$e.setContext(i),$e.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function W(Y){for(let ne=0;ne<Y.removed.length;ne++){let we=Y.removed[ne],se=M.indexOf(we);se>=0&&(M[se]=null,y[se].disconnect(we))}for(let ne=0;ne<Y.added.length;ne++){let we=Y.added[ne],se=M.indexOf(we);if(se===-1){for(let Ne=0;Ne<y.length;Ne++)if(Ne>=M.length){M.push(we),se=Ne;break}else if(M[Ne]===null){M[Ne]=we,se=Ne;break}if(se===-1)break}let Ee=y[se];Ee&&Ee.connect(we)}}let k=new b,ee=new b;function H(Y,ne,we){k.setFromMatrixPosition(ne.matrixWorld),ee.setFromMatrixPosition(we.matrixWorld);let se=k.distanceTo(ee),Ee=ne.projectionMatrix.elements,Ne=we.projectionMatrix.elements,De=Ee[14]/(Ee[10]-1),We=Ee[14]/(Ee[10]+1),J=(Ee[9]+1)/Ee[5],te=(Ee[9]-1)/Ee[5],P=(Ee[8]-1)/Ee[0],Pe=(Ne[8]+1)/Ne[0],K=De*P,ge=De*Pe,oe=se/(-P+Pe),Ce=oe*-P;if(ne.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Ce),Y.translateZ(oe),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Ee[10]===-1)Y.projectionMatrix.copy(ne.projectionMatrix),Y.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let pe=De+oe,I=We+oe,v=K-Ce,O=ge+(se-Ce),X=J*We/I*pe,q=te*We/I*pe;Y.projectionMatrix.makePerspective(v,O,X,q,pe,I),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ae(Y,ne){ne===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ne.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let ne=Y.near,we=Y.far;g.texture!==null&&(g.depthNear>0&&(ne=g.depthNear),g.depthFar>0&&(we=g.depthFar)),x.near=D.near=C.near=ne,x.far=D.far=C.far=we,(S!==x.near||V!==x.far)&&(i.updateRenderState({depthNear:x.near,depthFar:x.far}),S=x.near,V=x.far),C.layers.mask=Y.layers.mask|2,D.layers.mask=Y.layers.mask|4,x.layers.mask=C.layers.mask|D.layers.mask;let se=Y.parent,Ee=x.cameras;ae(x,se);for(let Ne=0;Ne<Ee.length;Ne++)ae(Ee[Ne],se);Ee.length===2?H(x,C,D):x.projectionMatrix.copy(C.projectionMatrix),fe(Y,x,se)};function fe(Y,ne,we){we===null?Y.matrix.copy(ne.matrixWorld):(Y.matrix.copy(we.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ne.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ne.projectionMatrix),Y.projectionMatrixInverse.copy(ne.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=xs*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(h===null&&d===null))return A},this.setFoveation=function(Y){A=Y,h!==null&&(h.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(x)};let xe=null;function Be(Y,ne){if(l=ne.getViewerPose(c||o),p=ne,l!==null){let we=l.views;d!==null&&(e.setRenderTargetFramebuffer(T,d.framebuffer),e.setRenderTarget(T));let se=!1;we.length!==x.cameras.length&&(x.cameras.length=0,se=!0);for(let Ne=0;Ne<we.length;Ne++){let De=we[Ne],We=null;if(d!==null)We=d.getViewport(De);else{let te=u.getViewSubImage(h,De);We=te.viewport,Ne===0&&(e.setRenderTargetTextures(T,te.colorTexture,h.ignoreDepthValues?void 0:te.depthStencilTexture),e.setRenderTarget(T))}let J=_[Ne];J===void 0&&(J=new Tt,J.layers.enable(Ne),J.viewport=new Ke,_[Ne]=J),J.matrix.fromArray(De.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(De.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(We.x,We.y,We.width,We.height),Ne===0&&(x.matrix.copy(J.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),se===!0&&x.cameras.push(J)}let Ee=i.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")){let Ne=u.getDepthInformation(we[0]);Ne&&Ne.isValid&&Ne.texture&&g.init(e,Ne,i.renderState)}}for(let we=0;we<y.length;we++){let se=M[we],Ee=y[we];se!==null&&Ee!==void 0&&Ee.update(se,ne,c||o)}xe&&xe(Y,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),p=null}let $e=new _h;$e.setAnimationLoop(Be),this.setAnimationLoop=function(Y){xe=Y},this.dispose=function(){}}},Pi=new vn,g0=new Re;function M0(s,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,yh(s)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function i(m,f,T,y,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),l(m,f)):f.isMeshStandardMaterial?(r(m,f),h(m,f),f.isMeshPhysicalMaterial&&d(m,f,M)):f.isMeshMatcapMaterial?(r(m,f),p(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),g(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?A(m,f,T,y):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Zt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Zt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let T=e.get(f),y=T.envMap,M=T.envMapRotation;y&&(m.envMap.value=y,Pi.copy(M),Pi.x*=-1,Pi.y*=-1,Pi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Pi.y*=-1,Pi.z*=-1),m.envMapRotation.value.setFromMatrix4(g0.makeRotationFromEuler(Pi)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function A(m,f,T,y){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*T,m.scale.value=y*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function h(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function d(m,f,T){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Zt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,f){f.matcap&&(m.matcap.value=f.matcap)}function g(m,f){let T=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function v0(s,e,t,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function A(T,y){let M=y.program;n.uniformBlockBinding(T,M)}function c(T,y){let M=i[T.id];M===void 0&&(p(T),M=l(T),i[T.id]=M,T.addEventListener("dispose",m));let R=y.program;n.updateUBOMapping(T,R);let E=e.render.frame;r[T.id]!==E&&(h(T),r[T.id]=E)}function l(T){let y=u();T.__bindingPointIndex=y;let M=s.createBuffer(),R=T.__size,E=T.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,R,E),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,y,M),M}function u(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(T){let y=i[T.id],M=T.uniforms,R=T.__cache;s.bindBuffer(s.UNIFORM_BUFFER,y);for(let E=0,C=M.length;E<C;E++){let D=Array.isArray(M[E])?M[E]:[M[E]];for(let _=0,x=D.length;_<x;_++){let S=D[_];if(d(S,E,_,R)===!0){let V=S.__offset,B=Array.isArray(S.value)?S.value:[S.value],F=0;for(let W=0;W<B.length;W++){let k=B[W],ee=g(k);typeof k=="number"||typeof k=="boolean"?(S.__data[0]=k,s.bufferSubData(s.UNIFORM_BUFFER,V+F,S.__data)):k.isMatrix3?(S.__data[0]=k.elements[0],S.__data[1]=k.elements[1],S.__data[2]=k.elements[2],S.__data[3]=0,S.__data[4]=k.elements[3],S.__data[5]=k.elements[4],S.__data[6]=k.elements[5],S.__data[7]=0,S.__data[8]=k.elements[6],S.__data[9]=k.elements[7],S.__data[10]=k.elements[8],S.__data[11]=0):(k.toArray(S.__data,F),F+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,V,S.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(T,y,M,R){let E=T.value,C=y+"_"+M;if(R[C]===void 0)return typeof E=="number"||typeof E=="boolean"?R[C]=E:R[C]=E.clone(),!0;{let D=R[C];if(typeof E=="number"||typeof E=="boolean"){if(D!==E)return R[C]=E,!0}else if(D.equals(E)===!1)return D.copy(E),!0}return!1}function p(T){let y=T.uniforms,M=0,R=16;for(let C=0,D=y.length;C<D;C++){let _=Array.isArray(y[C])?y[C]:[y[C]];for(let x=0,S=_.length;x<S;x++){let V=_[x],B=Array.isArray(V.value)?V.value:[V.value];for(let F=0,W=B.length;F<W;F++){let k=B[F],ee=g(k),H=M%R,ae=H%ee.boundary,fe=H+ae;M+=ae,fe!==0&&R-fe<ee.storage&&(M+=R-fe),V.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=M,M+=ee.storage}}}let E=M%R;return E>0&&(M+=R-E),T.__size=M,T.__cache={},this}function g(T){let y={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(y.boundary=4,y.storage=4):T.isVector2?(y.boundary=8,y.storage=8):T.isVector3||T.isColor?(y.boundary=16,y.storage=12):T.isVector4?(y.boundary=16,y.storage=16):T.isMatrix3?(y.boundary=48,y.storage=48):T.isMatrix4?(y.boundary=64,y.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),y}function m(T){let y=T.target;y.removeEventListener("dispose",m);let M=o.indexOf(y.__bindingPointIndex);o.splice(M,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function f(){for(let T in i)s.deleteBuffer(i[T]);o=[],i={},r={}}return{bind:A,update:c,dispose:f}}var To=class{constructor(e={}){let{canvas:t=_f(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:A=!0,preserveDrawingBuffer:c=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;let p=new Uint32Array(4),g=new Int32Array(4),m=null,f=null,T=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=gt,this.toneMapping=Ai,this.toneMappingExposure=1;let M=this,R=!1,E=0,C=0,D=null,_=-1,x=null,S=new Ke,V=new Ke,B=null,F=new Le(0),W=0,k=t.width,ee=t.height,H=1,ae=null,fe=null,xe=new Ke(0,0,k,ee),Be=new Ke(0,0,k,ee),$e=!1,Y=new or,ne=!1,we=!1,se=new Re,Ee=new Re,Ne=new b,De=new Ke,We={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},J=!1;function te(){return D===null?H:1}let P=n;function Pe(w,z){return t.getContext(w,z)}try{let w={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:A,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${_c}`),t.addEventListener("webglcontextlost",Q,!1),t.addEventListener("webglcontextrestored",de,!1),t.addEventListener("webglcontextcreationerror",ue,!1),P===null){let z="webgl2";if(P=Pe(z,w),P===null)throw Pe(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let K,ge,oe,Ce,pe,I,v,O,X,q,G,ye,ce,me,je,$,Me,Se,ze,ve,Ge,ke,ct,L;function le(){K=new Ng(P),K.init(),ke=new d0(P,K),ge=new Cg(P,K,e,ke),oe=new l0(P,K),ge.reverseDepthBuffer&&h&&oe.buffers.depth.setReversed(!0),Ce=new Ug(P),pe=new qM,I=new h0(P,K,oe,pe,ge,ke,Ce),v=new Dg(M),O=new zg(M),X=new Xf(P),ct=new bg(P,X),q=new Og(P,X,Ce,ct),G=new Fg(P,q,X,Ce),ze=new Zg(P,ge,I),$=new Sg(pe),ye=new JM(M,v,O,K,ge,ct,$),ce=new M0(M,pe),me=new $M,je=new r0(K),Se=new Pg(M,v,O,oe,G,d,A),Me=new A0(M,G,ge),L=new v0(P,Ce,ge,oe),ve=new Eg(P,K,Ce),Ge=new Bg(P,K,Ce),Ce.programs=ye.programs,M.capabilities=ge,M.extensions=K,M.properties=pe,M.renderLists=me,M.shadowMap=Me,M.state=oe,M.info=Ce}le();let j=new ec(M,P);this.xr=j,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let w=K.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=K.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(w){w!==void 0&&(H=w,this.setSize(k,ee,!1))},this.getSize=function(w){return w.set(k,ee)},this.setSize=function(w,z,U=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=w,ee=z,t.width=Math.floor(w*H),t.height=Math.floor(z*H),U===!0&&(t.style.width=w+"px",t.style.height=z+"px"),this.setViewport(0,0,w,z)},this.getDrawingBufferSize=function(w){return w.set(k*H,ee*H).floor()},this.setDrawingBufferSize=function(w,z,U){k=w,ee=z,H=U,t.width=Math.floor(w*U),t.height=Math.floor(z*U),this.setViewport(0,0,w,z)},this.getCurrentViewport=function(w){return w.copy(S)},this.getViewport=function(w){return w.copy(xe)},this.setViewport=function(w,z,U,Z){w.isVector4?xe.set(w.x,w.y,w.z,w.w):xe.set(w,z,U,Z),oe.viewport(S.copy(xe).multiplyScalar(H).round())},this.getScissor=function(w){return w.copy(Be)},this.setScissor=function(w,z,U,Z){w.isVector4?Be.set(w.x,w.y,w.z,w.w):Be.set(w,z,U,Z),oe.scissor(V.copy(Be).multiplyScalar(H).round())},this.getScissorTest=function(){return $e},this.setScissorTest=function(w){oe.setScissorTest($e=w)},this.setOpaqueSort=function(w){ae=w},this.setTransparentSort=function(w){fe=w},this.getClearColor=function(w){return w.copy(Se.getClearColor())},this.setClearColor=function(){Se.setClearColor.apply(Se,arguments)},this.getClearAlpha=function(){return Se.getClearAlpha()},this.setClearAlpha=function(){Se.setClearAlpha.apply(Se,arguments)},this.clear=function(w=!0,z=!0,U=!0){let Z=0;if(w){let N=!1;if(D!==null){let ie=D.texture.format;N=ie===Rc||ie===Lc||ie===Dc}if(N){let ie=D.texture.type,he=ie===Un||ie===Li||ie===ir||ie===ms||ie===Ec||ie===Cc,_e=Se.getClearColor(),Te=Se.getClearAlpha(),Oe=_e.r,Ze=_e.g,Ie=_e.b;he?(p[0]=Oe,p[1]=Ze,p[2]=Ie,p[3]=Te,P.clearBufferuiv(P.COLOR,0,p)):(g[0]=Oe,g[1]=Ze,g[2]=Ie,g[3]=Te,P.clearBufferiv(P.COLOR,0,g))}else Z|=P.COLOR_BUFFER_BIT}z&&(Z|=P.DEPTH_BUFFER_BIT),U&&(Z|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Q,!1),t.removeEventListener("webglcontextrestored",de,!1),t.removeEventListener("webglcontextcreationerror",ue,!1),me.dispose(),je.dispose(),pe.dispose(),v.dispose(),O.dispose(),G.dispose(),ct.dispose(),L.dispose(),ye.dispose(),j.dispose(),j.removeEventListener("sessionstart",bl),j.removeEventListener("sessionend",El),xi.stop()};function Q(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function de(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;let w=Ce.autoReset,z=Me.enabled,U=Me.autoUpdate,Z=Me.needsUpdate,N=Me.type;le(),Ce.autoReset=w,Me.enabled=z,Me.autoUpdate=U,Me.needsUpdate=Z,Me.type=N}function ue(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Ue(w){let z=w.target;z.removeEventListener("dispose",Ue),pt(z)}function pt(w){bt(w),pe.remove(w)}function bt(w){let z=pe.get(w).programs;z!==void 0&&(z.forEach(function(U){ye.releaseProgram(U)}),w.isShaderMaterial&&ye.releaseShaderCache(w))}this.renderBufferDirect=function(w,z,U,Z,N,ie){z===null&&(z=We);let he=N.isMesh&&N.matrixWorld.determinant()<0,_e=md(w,z,U,Z,N);oe.setMaterial(Z,he);let Te=U.index,Oe=1;if(Z.wireframe===!0){if(Te=q.getWireframeAttribute(U),Te===void 0)return;Oe=2}let Ze=U.drawRange,Ie=U.attributes.position,Je=Ze.start*Oe,lt=(Ze.start+Ze.count)*Oe;ie!==null&&(Je=Math.max(Je,ie.start*Oe),lt=Math.min(lt,(ie.start+ie.count)*Oe)),Te!==null?(Je=Math.max(Je,0),lt=Math.min(lt,Te.count)):Ie!=null&&(Je=Math.max(Je,0),lt=Math.min(lt,Ie.count));let ut=lt-Je;if(ut<0||ut===1/0)return;ct.setup(N,Z,_e,U,Te);let Ot,et=ve;if(Te!==null&&(Ot=X.get(Te),et=Ge,et.setIndex(Ot)),N.isMesh)Z.wireframe===!0?(oe.setLineWidth(Z.wireframeLinewidth*te()),et.setMode(P.LINES)):et.setMode(P.TRIANGLES);else if(N.isLine){let be=Z.linewidth;be===void 0&&(be=1),oe.setLineWidth(be*te()),N.isLineSegments?et.setMode(P.LINES):N.isLineLoop?et.setMode(P.LINE_LOOP):et.setMode(P.LINE_STRIP)}else N.isPoints?et.setMode(P.POINTS):N.isSprite&&et.setMode(P.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)et.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(K.get("WEBGL_multi_draw"))et.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{let be=N._multiDrawStarts,Pn=N._multiDrawCounts,tt=N._multiDrawCount,An=Te?X.get(Te).bytesPerElement:1,Vi=pe.get(Z).currentProgram.getUniforms();for(let kt=0;kt<tt;kt++)Vi.setValue(P,"_gl_DrawID",kt),et.render(be[kt]/An,Pn[kt])}else if(N.isInstancedMesh)et.renderInstances(Je,ut,N.count);else if(U.isInstancedBufferGeometry){let be=U._maxInstanceCount!==void 0?U._maxInstanceCount:1/0,Pn=Math.min(U.instanceCount,be);et.renderInstances(Je,ut,Pn)}else et.render(Je,ut)};function nt(w,z,U){w.transparent===!0&&w.side===Bt&&w.forceSinglePass===!1?(w.side=Zt,w.needsUpdate=!0,Dr(w,z,U),w.side=Mn,w.needsUpdate=!0,Dr(w,z,U),w.side=Bt):Dr(w,z,U)}this.compile=function(w,z,U=null){U===null&&(U=w),f=je.get(U),f.init(z),y.push(f),U.traverseVisible(function(N){N.isLight&&N.layers.test(z.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),w!==U&&w.traverseVisible(function(N){N.isLight&&N.layers.test(z.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();let Z=new Set;return w.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;let ie=N.material;if(ie)if(Array.isArray(ie))for(let he=0;he<ie.length;he++){let _e=ie[he];nt(_e,U,N),Z.add(_e)}else nt(ie,U,N),Z.add(ie)}),y.pop(),f=null,Z},this.compileAsync=function(w,z,U=null){let Z=this.compile(w,z,U);return new Promise(N=>{function ie(){if(Z.forEach(function(he){pe.get(he).currentProgram.isReady()&&Z.delete(he)}),Z.size===0){N(w);return}setTimeout(ie,10)}K.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let an=null;function In(w){an&&an(w)}function bl(){xi.stop()}function El(){xi.start()}let xi=new _h;xi.setAnimationLoop(In),typeof self<"u"&&xi.setContext(self),this.setAnimationLoop=function(w){an=w,j.setAnimationLoop(w),w===null?xi.stop():xi.start()},j.addEventListener("sessionstart",bl),j.addEventListener("sessionend",El),this.render=function(w,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(z),z=j.getCamera()),w.isScene===!0&&w.onBeforeRender(M,w,z,D),f=je.get(w,y.length),f.init(z),y.push(f),Ee.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),Y.setFromProjectionMatrix(Ee),we=this.localClippingEnabled,ne=$.init(this.clippingPlanes,we),m=me.get(w,T.length),m.init(),T.push(m),j.enabled===!0&&j.isPresenting===!0){let ie=M.xr.getDepthSensingMesh();ie!==null&&va(ie,z,-1/0,M.sortObjects)}va(w,z,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(ae,fe),J=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,J&&Se.addToRenderList(m,w),this.info.render.frame++,ne===!0&&$.beginShadows();let U=f.state.shadowsArray;Me.render(U,w,z),ne===!0&&$.endShadows(),this.info.autoReset===!0&&this.info.reset();let Z=m.opaque,N=m.transmissive;if(f.setupLights(),z.isArrayCamera){let ie=z.cameras;if(N.length>0)for(let he=0,_e=ie.length;he<_e;he++){let Te=ie[he];Sl(Z,N,w,Te)}J&&Se.render(w);for(let he=0,_e=ie.length;he<_e;he++){let Te=ie[he];Cl(m,w,Te,Te.viewport)}}else N.length>0&&Sl(Z,N,w,z),J&&Se.render(w),Cl(m,w,z);D!==null&&(I.updateMultisampleRenderTarget(D),I.updateRenderTargetMipmap(D)),w.isScene===!0&&w.onAfterRender(M,w,z),ct.resetDefaultState(),_=-1,x=null,y.pop(),y.length>0?(f=y[y.length-1],ne===!0&&$.setGlobalState(M.clippingPlanes,f.state.camera)):f=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function va(w,z,U,Z){if(w.visible===!1)return;if(w.layers.test(z.layers)){if(w.isGroup)U=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(z);else if(w.isLight)f.pushLight(w),w.castShadow&&f.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Y.intersectsSprite(w)){Z&&De.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Ee);let he=G.update(w),_e=w.material;_e.visible&&m.push(w,he,_e,U,De.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Y.intersectsObject(w))){let he=G.update(w),_e=w.material;if(Z&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),De.copy(w.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),De.copy(he.boundingSphere.center)),De.applyMatrix4(w.matrixWorld).applyMatrix4(Ee)),Array.isArray(_e)){let Te=he.groups;for(let Oe=0,Ze=Te.length;Oe<Ze;Oe++){let Ie=Te[Oe],Je=_e[Ie.materialIndex];Je&&Je.visible&&m.push(w,he,Je,U,De.z,Ie)}}else _e.visible&&m.push(w,he,_e,U,De.z,null)}}let ie=w.children;for(let he=0,_e=ie.length;he<_e;he++)va(ie[he],z,U,Z)}function Cl(w,z,U,Z){let N=w.opaque,ie=w.transmissive,he=w.transparent;f.setupLightsView(U),ne===!0&&$.setGlobalState(M.clippingPlanes,U),Z&&oe.viewport(S.copy(Z)),N.length>0&&Sr(N,z,U),ie.length>0&&Sr(ie,z,U),he.length>0&&Sr(he,z,U),oe.buffers.depth.setTest(!0),oe.buffers.depth.setMask(!0),oe.buffers.color.setMask(!0),oe.setPolygonOffset(!1)}function Sl(w,z,U,Z){if((U.isScene===!0?U.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[Z.id]===void 0&&(f.state.transmissionRenderTarget[Z.id]=new Fn(1,1,{generateMipmaps:!0,type:K.has("EXT_color_buffer_half_float")||K.has("EXT_color_buffer_float")?wr:Un,minFilter:gn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Xe.workingColorSpace}));let ie=f.state.transmissionRenderTarget[Z.id],he=Z.viewport||S;ie.setSize(he.z,he.w);let _e=M.getRenderTarget();M.setRenderTarget(ie),M.getClearColor(F),W=M.getClearAlpha(),W<1&&M.setClearColor(16777215,.5),M.clear(),J&&Se.render(U);let Te=M.toneMapping;M.toneMapping=Ai;let Oe=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),f.setupLightsView(Z),ne===!0&&$.setGlobalState(M.clippingPlanes,Z),Sr(w,U,Z),I.updateMultisampleRenderTarget(ie),I.updateRenderTargetMipmap(ie),K.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let Ie=0,Je=z.length;Ie<Je;Ie++){let lt=z[Ie],ut=lt.object,Ot=lt.geometry,et=lt.material,be=lt.group;if(et.side===Bt&&ut.layers.test(Z.layers)){let Pn=et.side;et.side=Zt,et.needsUpdate=!0,Dl(ut,U,Z,Ot,et,be),et.side=Pn,et.needsUpdate=!0,Ze=!0}}Ze===!0&&(I.updateMultisampleRenderTarget(ie),I.updateRenderTargetMipmap(ie))}M.setRenderTarget(_e),M.setClearColor(F,W),Oe!==void 0&&(Z.viewport=Oe),M.toneMapping=Te}function Sr(w,z,U){let Z=z.isScene===!0?z.overrideMaterial:null;for(let N=0,ie=w.length;N<ie;N++){let he=w[N],_e=he.object,Te=he.geometry,Oe=Z===null?he.material:Z,Ze=he.group;_e.layers.test(U.layers)&&Dl(_e,z,U,Te,Oe,Ze)}}function Dl(w,z,U,Z,N,ie){w.onBeforeRender(M,z,U,Z,N,ie),w.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),N.onBeforeRender(M,z,U,Z,w,ie),N.transparent===!0&&N.side===Bt&&N.forceSinglePass===!1?(N.side=Zt,N.needsUpdate=!0,M.renderBufferDirect(U,z,Z,N,w,ie),N.side=Mn,N.needsUpdate=!0,M.renderBufferDirect(U,z,Z,N,w,ie),N.side=Bt):M.renderBufferDirect(U,z,Z,N,w,ie),w.onAfterRender(M,z,U,Z,N,ie)}function Dr(w,z,U){z.isScene!==!0&&(z=We);let Z=pe.get(w),N=f.state.lights,ie=f.state.shadowsArray,he=N.state.version,_e=ye.getParameters(w,N.state,ie,z,U),Te=ye.getProgramCacheKey(_e),Oe=Z.programs;Z.environment=w.isMeshStandardMaterial?z.environment:null,Z.fog=z.fog,Z.envMap=(w.isMeshStandardMaterial?O:v).get(w.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&w.envMap===null?z.environmentRotation:w.envMapRotation,Oe===void 0&&(w.addEventListener("dispose",Ue),Oe=new Map,Z.programs=Oe);let Ze=Oe.get(Te);if(Ze!==void 0){if(Z.currentProgram===Ze&&Z.lightsStateVersion===he)return Rl(w,_e),Ze}else _e.uniforms=ye.getUniforms(w),w.onBeforeCompile(_e,M),Ze=ye.acquireProgram(_e,Te),Oe.set(Te,Ze),Z.uniforms=_e.uniforms;let Ie=Z.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ie.clippingPlanes=$.uniform),Rl(w,_e),Z.needsLights=Md(w),Z.lightsStateVersion=he,Z.needsLights&&(Ie.ambientLightColor.value=N.state.ambient,Ie.lightProbe.value=N.state.probe,Ie.directionalLights.value=N.state.directional,Ie.directionalLightShadows.value=N.state.directionalShadow,Ie.spotLights.value=N.state.spot,Ie.spotLightShadows.value=N.state.spotShadow,Ie.rectAreaLights.value=N.state.rectArea,Ie.ltc_1.value=N.state.rectAreaLTC1,Ie.ltc_2.value=N.state.rectAreaLTC2,Ie.pointLights.value=N.state.point,Ie.pointLightShadows.value=N.state.pointShadow,Ie.hemisphereLights.value=N.state.hemi,Ie.directionalShadowMap.value=N.state.directionalShadowMap,Ie.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Ie.spotShadowMap.value=N.state.spotShadowMap,Ie.spotLightMatrix.value=N.state.spotLightMatrix,Ie.spotLightMap.value=N.state.spotLightMap,Ie.pointShadowMap.value=N.state.pointShadowMap,Ie.pointShadowMatrix.value=N.state.pointShadowMatrix),Z.currentProgram=Ze,Z.uniformsList=null,Ze}function Ll(w){if(w.uniformsList===null){let z=w.currentProgram.getUniforms();w.uniformsList=hs.seqWithValue(z.seq,w.uniforms)}return w.uniformsList}function Rl(w,z){let U=pe.get(w);U.outputColorSpace=z.outputColorSpace,U.batching=z.batching,U.batchingColor=z.batchingColor,U.instancing=z.instancing,U.instancingColor=z.instancingColor,U.instancingMorph=z.instancingMorph,U.skinning=z.skinning,U.morphTargets=z.morphTargets,U.morphNormals=z.morphNormals,U.morphColors=z.morphColors,U.morphTargetsCount=z.morphTargetsCount,U.numClippingPlanes=z.numClippingPlanes,U.numIntersection=z.numClipIntersection,U.vertexAlphas=z.vertexAlphas,U.vertexTangents=z.vertexTangents,U.toneMapping=z.toneMapping}function md(w,z,U,Z,N){z.isScene!==!0&&(z=We),I.resetTextureUnits();let ie=z.fog,he=Z.isMeshStandardMaterial?z.environment:null,_e=D===null?M.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Dt,Te=(Z.isMeshStandardMaterial?O:v).get(Z.envMap||he),Oe=Z.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,Ze=!!U.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Ie=!!U.morphAttributes.position,Je=!!U.morphAttributes.normal,lt=!!U.morphAttributes.color,ut=Ai;Z.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(ut=M.toneMapping);let Ot=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,et=Ot!==void 0?Ot.length:0,be=pe.get(Z),Pn=f.state.lights;if(ne===!0&&(we===!0||w!==x)){let Wt=w===x&&Z.id===_;$.setState(Z,w,Wt)}let tt=!1;Z.version===be.__version?(be.needsLights&&be.lightsStateVersion!==Pn.state.version||be.outputColorSpace!==_e||N.isBatchedMesh&&be.batching===!1||!N.isBatchedMesh&&be.batching===!0||N.isBatchedMesh&&be.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&be.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&be.instancing===!1||!N.isInstancedMesh&&be.instancing===!0||N.isSkinnedMesh&&be.skinning===!1||!N.isSkinnedMesh&&be.skinning===!0||N.isInstancedMesh&&be.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&be.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&be.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&be.instancingMorph===!1&&N.morphTexture!==null||be.envMap!==Te||Z.fog===!0&&be.fog!==ie||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==$.numPlanes||be.numIntersection!==$.numIntersection)||be.vertexAlphas!==Oe||be.vertexTangents!==Ze||be.morphTargets!==Ie||be.morphNormals!==Je||be.morphColors!==lt||be.toneMapping!==ut||be.morphTargetsCount!==et)&&(tt=!0):(tt=!0,be.__version=Z.version);let An=be.currentProgram;tt===!0&&(An=Dr(Z,z,N));let Vi=!1,kt=!1,Bs=!1,ht=An.getUniforms(),pn=be.uniforms;if(oe.useProgram(An.program)&&(Vi=!0,kt=!0,Bs=!0),Z.id!==_&&(_=Z.id,kt=!0),Vi||x!==w){oe.buffers.depth.getReversed()?(se.copy(w.projectionMatrix),If(se),Pf(se),ht.setValue(P,"projectionMatrix",se)):ht.setValue(P,"projectionMatrix",w.projectionMatrix),ht.setValue(P,"viewMatrix",w.matrixWorldInverse);let qn=ht.map.cameraPosition;qn!==void 0&&qn.setValue(P,Ne.setFromMatrixPosition(w.matrixWorld)),ge.logarithmicDepthBuffer&&ht.setValue(P,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&ht.setValue(P,"isOrthographic",w.isOrthographicCamera===!0),x!==w&&(x=w,kt=!0,Bs=!0)}if(N.isSkinnedMesh){ht.setOptional(P,N,"bindMatrix"),ht.setOptional(P,N,"bindMatrixInverse");let Wt=N.skeleton;Wt&&(Wt.boneTexture===null&&Wt.computeBoneTexture(),ht.setValue(P,"boneTexture",Wt.boneTexture,I))}N.isBatchedMesh&&(ht.setOptional(P,N,"batchingTexture"),ht.setValue(P,"batchingTexture",N._matricesTexture,I),ht.setOptional(P,N,"batchingIdTexture"),ht.setValue(P,"batchingIdTexture",N._indirectTexture,I),ht.setOptional(P,N,"batchingColorTexture"),N._colorsTexture!==null&&ht.setValue(P,"batchingColorTexture",N._colorsTexture,I));let Us=U.morphAttributes;if((Us.position!==void 0||Us.normal!==void 0||Us.color!==void 0)&&ze.update(N,U,An),(kt||be.receiveShadow!==N.receiveShadow)&&(be.receiveShadow=N.receiveShadow,ht.setValue(P,"receiveShadow",N.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(pn.envMap.value=Te,pn.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&z.environment!==null&&(pn.envMapIntensity.value=z.environmentIntensity),kt&&(ht.setValue(P,"toneMappingExposure",M.toneMappingExposure),be.needsLights&&gd(pn,Bs),ie&&Z.fog===!0&&ce.refreshFogUniforms(pn,ie),ce.refreshMaterialUniforms(pn,Z,H,ee,f.state.transmissionRenderTarget[w.id]),hs.upload(P,Ll(be),pn,I)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(hs.upload(P,Ll(be),pn,I),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&ht.setValue(P,"center",N.center),ht.setValue(P,"modelViewMatrix",N.modelViewMatrix),ht.setValue(P,"normalMatrix",N.normalMatrix),ht.setValue(P,"modelMatrix",N.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){let Wt=Z.uniformsGroups;for(let qn=0,Kn=Wt.length;qn<Kn;qn++){let zl=Wt[qn];L.update(zl,An),L.bind(zl,An)}}return An}function gd(w,z){w.ambientLightColor.needsUpdate=z,w.lightProbe.needsUpdate=z,w.directionalLights.needsUpdate=z,w.directionalLightShadows.needsUpdate=z,w.pointLights.needsUpdate=z,w.pointLightShadows.needsUpdate=z,w.spotLights.needsUpdate=z,w.spotLightShadows.needsUpdate=z,w.rectAreaLights.needsUpdate=z,w.hemisphereLights.needsUpdate=z}function Md(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(w,z,U){pe.get(w.texture).__webglTexture=z,pe.get(w.depthTexture).__webglTexture=U;let Z=pe.get(w);Z.__hasExternalTextures=!0,Z.__autoAllocateDepthBuffer=U===void 0,Z.__autoAllocateDepthBuffer||K.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,z){let U=pe.get(w);U.__webglFramebuffer=z,U.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(w,z=0,U=0){D=w,E=z,C=U;let Z=!0,N=null,ie=!1,he=!1;if(w){let Te=pe.get(w);if(Te.__useDefaultFramebuffer!==void 0)oe.bindFramebuffer(P.FRAMEBUFFER,null),Z=!1;else if(Te.__webglFramebuffer===void 0)I.setupRenderTarget(w);else if(Te.__hasExternalTextures)I.rebindTextures(w,pe.get(w.texture).__webglTexture,pe.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Ie=w.depthTexture;if(Te.__boundDepthTexture!==Ie){if(Ie!==null&&pe.has(Ie)&&(w.width!==Ie.image.width||w.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(w)}}let Oe=w.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(he=!0);let Ze=pe.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ze[z])?N=Ze[z][U]:N=Ze[z],ie=!0):w.samples>0&&I.useMultisampledRTT(w)===!1?N=pe.get(w).__webglMultisampledFramebuffer:Array.isArray(Ze)?N=Ze[U]:N=Ze,S.copy(w.viewport),V.copy(w.scissor),B=w.scissorTest}else S.copy(xe).multiplyScalar(H).floor(),V.copy(Be).multiplyScalar(H).floor(),B=$e;if(oe.bindFramebuffer(P.FRAMEBUFFER,N)&&Z&&oe.drawBuffers(w,N),oe.viewport(S),oe.scissor(V),oe.setScissorTest(B),ie){let Te=pe.get(w.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+z,Te.__webglTexture,U)}else if(he){let Te=pe.get(w.texture),Oe=z||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,Te.__webglTexture,U||0,Oe)}_=-1},this.readRenderTargetPixels=function(w,z,U,Z,N,ie,he){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=pe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&he!==void 0&&(_e=_e[he]),_e){oe.bindFramebuffer(P.FRAMEBUFFER,_e);try{let Te=w.texture,Oe=Te.format,Ze=Te.type;if(!ge.textureFormatReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ge.textureTypeReadable(Ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=w.width-Z&&U>=0&&U<=w.height-N&&P.readPixels(z,U,Z,N,ke.convert(Oe),ke.convert(Ze),ie)}finally{let Te=D!==null?pe.get(D).__webglFramebuffer:null;oe.bindFramebuffer(P.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(w,z,U,Z,N,ie,he){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=pe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&he!==void 0&&(_e=_e[he]),_e){let Te=w.texture,Oe=Te.format,Ze=Te.type;if(!ge.textureFormatReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ge.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(z>=0&&z<=w.width-Z&&U>=0&&U<=w.height-N){oe.bindFramebuffer(P.FRAMEBUFFER,_e);let Ie=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Ie),P.bufferData(P.PIXEL_PACK_BUFFER,ie.byteLength,P.STREAM_READ),P.readPixels(z,U,Z,N,ke.convert(Oe),ke.convert(Ze),0);let Je=D!==null?pe.get(D).__webglFramebuffer:null;oe.bindFramebuffer(P.FRAMEBUFFER,Je);let lt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await Tf(P,lt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Ie),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ie),P.deleteBuffer(Ie),P.deleteSync(lt),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,z=null,U=0){w.isTexture!==!0&&(Ys("WebGLRenderer: copyFramebufferToTexture function signature has changed."),z=arguments[0]||null,w=arguments[1]);let Z=Math.pow(2,-U),N=Math.floor(w.image.width*Z),ie=Math.floor(w.image.height*Z),he=z!==null?z.x:0,_e=z!==null?z.y:0;I.setTexture2D(w,0),P.copyTexSubImage2D(P.TEXTURE_2D,U,0,0,he,_e,N,ie),oe.unbindTexture()},this.copyTextureToTexture=function(w,z,U=null,Z=null,N=0){w.isTexture!==!0&&(Ys("WebGLRenderer: copyTextureToTexture function signature has changed."),Z=arguments[0]||null,w=arguments[1],z=arguments[2],N=arguments[3]||0,U=null);let ie,he,_e,Te,Oe,Ze,Ie,Je,lt,ut=w.isCompressedTexture?w.mipmaps[N]:w.image;U!==null?(ie=U.max.x-U.min.x,he=U.max.y-U.min.y,_e=U.isBox3?U.max.z-U.min.z:1,Te=U.min.x,Oe=U.min.y,Ze=U.isBox3?U.min.z:0):(ie=ut.width,he=ut.height,_e=ut.depth||1,Te=0,Oe=0,Ze=0),Z!==null?(Ie=Z.x,Je=Z.y,lt=Z.z):(Ie=0,Je=0,lt=0);let Ot=ke.convert(z.format),et=ke.convert(z.type),be;z.isData3DTexture?(I.setTexture3D(z,0),be=P.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(I.setTexture2DArray(z,0),be=P.TEXTURE_2D_ARRAY):(I.setTexture2D(z,0),be=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,z.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,z.unpackAlignment);let Pn=P.getParameter(P.UNPACK_ROW_LENGTH),tt=P.getParameter(P.UNPACK_IMAGE_HEIGHT),An=P.getParameter(P.UNPACK_SKIP_PIXELS),Vi=P.getParameter(P.UNPACK_SKIP_ROWS),kt=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,ut.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ut.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Te),P.pixelStorei(P.UNPACK_SKIP_ROWS,Oe),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ze);let Bs=w.isDataArrayTexture||w.isData3DTexture,ht=z.isDataArrayTexture||z.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){let pn=pe.get(w),Us=pe.get(z),Wt=pe.get(pn.__renderTarget),qn=pe.get(Us.__renderTarget);oe.bindFramebuffer(P.READ_FRAMEBUFFER,Wt.__webglFramebuffer),oe.bindFramebuffer(P.DRAW_FRAMEBUFFER,qn.__webglFramebuffer);for(let Kn=0;Kn<_e;Kn++)Bs&&P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,pe.get(w).__webglTexture,N,Ze+Kn),w.isDepthTexture?(ht&&P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,pe.get(z).__webglTexture,N,lt+Kn),P.blitFramebuffer(Te,Oe,ie,he,Ie,Je,ie,he,P.DEPTH_BUFFER_BIT,P.NEAREST)):ht?P.copyTexSubImage3D(be,N,Ie,Je,lt+Kn,Te,Oe,ie,he):P.copyTexSubImage2D(be,N,Ie,Je,lt+Kn,Te,Oe,ie,he);oe.bindFramebuffer(P.READ_FRAMEBUFFER,null),oe.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else ht?w.isDataTexture||w.isData3DTexture?P.texSubImage3D(be,N,Ie,Je,lt,ie,he,_e,Ot,et,ut.data):z.isCompressedArrayTexture?P.compressedTexSubImage3D(be,N,Ie,Je,lt,ie,he,_e,Ot,ut.data):P.texSubImage3D(be,N,Ie,Je,lt,ie,he,_e,Ot,et,ut):w.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,N,Ie,Je,ie,he,Ot,et,ut.data):w.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,N,Ie,Je,ut.width,ut.height,Ot,ut.data):P.texSubImage2D(P.TEXTURE_2D,N,Ie,Je,ie,he,Ot,et,ut);P.pixelStorei(P.UNPACK_ROW_LENGTH,Pn),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,tt),P.pixelStorei(P.UNPACK_SKIP_PIXELS,An),P.pixelStorei(P.UNPACK_SKIP_ROWS,Vi),P.pixelStorei(P.UNPACK_SKIP_IMAGES,kt),N===0&&z.generateMipmaps&&P.generateMipmap(be),oe.unbindTexture()},this.copyTextureToTexture3D=function(w,z,U=null,Z=null,N=0){return w.isTexture!==!0&&(Ys("WebGLRenderer: copyTextureToTexture3D function signature has changed."),U=arguments[0]||null,Z=arguments[1]||null,w=arguments[2],z=arguments[3],N=arguments[4]||0),Ys('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,z,U,Z,N)},this.initRenderTarget=function(w){pe.get(w).__webglFramebuffer===void 0&&I.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?I.setTextureCube(w,0):w.isData3DTexture?I.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?I.setTexture2DArray(w,0):I.setTexture2D(w,0),oe.unbindTexture()},this.resetState=function(){E=0,C=0,D=null,oe.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=Xe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xe._getUnpackColorSpace()}};var Io=class extends dt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vn,this.environmentIntensity=1,this.environmentRotation=new vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},ar=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=UA,this.updateRanges=[],this.version=0,this.uuid=qt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=qt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=qt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Lt=new b,Ar=class s{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix4(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyNormalMatrix(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.transformDirection(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=hn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=it(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=it(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=hn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=hn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=hn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=hn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=it(t,this.array),n=it(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=it(t,this.array),n=it(n,this.array),i=it(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=it(t,this.array),n=it(n,this.array),i=it(i,this.array),r=it(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new vt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new s(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var Ru=new b,zu=new Ke,Nu=new Ke,x0=new b,Ou=new Re,Kr=new b,Ya=new jt,Bu=new Re,Wa=new Ri,Po=class extends At{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Zl,this.bindMatrix=new Re,this.bindMatrixInverse=new Re,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Kt),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Kr),this.boundingBox.expandByPoint(Kr)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new jt),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Kr),this.boundingSphere.expandByPoint(Kr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ya.copy(this.boundingSphere),Ya.applyMatrix4(i),e.ray.intersectsSphere(Ya)!==!1&&(Bu.copy(i).invert(),Wa.copy(e.ray).applyMatrix4(Bu),!(this.boundingBox!==null&&Wa.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Wa)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Ke,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Zl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Yd?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;zu.fromBufferAttribute(i.attributes.skinIndex,e),Nu.fromBufferAttribute(i.attributes.skinWeight,e),Ru.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=Nu.getComponent(r);if(o!==0){let a=zu.getComponent(r);Ou.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(x0.copy(Ru).applyMatrix4(Ou),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},cr=class extends dt{constructor(){super(),this.isBone=!0,this.type="Bone"}},bo=class extends It{constructor(e=null,t=1,n=1,i,r,o,a,A,c=St,l=St,u,h){super(null,o,a,A,c,l,i,r,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Uu=new Re,w0=new Re,Eo=class s{constructor(e=[],t=[]){this.uuid=qt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Re)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Re;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:w0;Uu.multiplyMatrices(a,t[r]),Uu.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new bo(t,e,e,Jt,dn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let r=e.bones[n],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new cr),this.bones.push(o),this.boneInverses.push(new Re().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){let o=t[i];e.bones.push(o.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}},Oi=class extends vt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},is=new Re,Zu=new Re,$r=[],Fu=new Kt,y0=new Re,Hs=new At,js=new jt,Co=class extends At{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Oi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,y0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Kt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,is),Fu.copy(e.boundingBox).applyMatrix4(is),this.boundingBox.union(Fu)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new jt),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,is),js.copy(e.boundingSphere).applyMatrix4(is),this.boundingSphere.union(js)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Hs.geometry=this.geometry,Hs.material=this.material,Hs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),js.copy(this.boundingSphere),js.applyMatrix4(n),e.ray.intersectsSphere(js)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,is),Zu.multiplyMatrices(n,is),Hs.matrixWorld=Zu,Hs.raycast(e,$r);for(let o=0,a=$r.length;o<a;o++){let A=$r[o];A.instanceId=r,A.object=this,t.push(A)}$r.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Oi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new bo(new Float32Array(i*this.count),i,this.count,Sc,dn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,A=i*e;r[A]=a,r.set(n,A+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var lr=class extends Xt{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Le(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},So=new b,Do=new b,ku=new Re,Xs=new Ri,eo=new jt,Qa=new b,Vu=new b,ys=class extends dt{constructor(e=new Nt,t=new lr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)So.fromBufferAttribute(t,i-1),Do.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=So.distanceTo(Do);e.setAttribute("lineDistance",new Mt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),eo.copy(n.boundingSphere),eo.applyMatrix4(i),eo.radius+=r,e.ray.intersectsSphere(eo)===!1)return;ku.copy(i).invert(),Xs.copy(e.ray).applyMatrix4(ku);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),A=a*a,c=this.isLineSegments?2:1,l=n.index,h=n.attributes.position;if(l!==null){let d=Math.max(0,o.start),p=Math.min(l.count,o.start+o.count);for(let g=d,m=p-1;g<m;g+=c){let f=l.getX(g),T=l.getX(g+1),y=to(this,e,Xs,A,f,T);y&&t.push(y)}if(this.isLineLoop){let g=l.getX(p-1),m=l.getX(d),f=to(this,e,Xs,A,g,m);f&&t.push(f)}}else{let d=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let g=d,m=p-1;g<m;g+=c){let f=to(this,e,Xs,A,g,g+1);f&&t.push(f)}if(this.isLineLoop){let g=to(this,e,Xs,A,p-1,d);g&&t.push(g)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function to(s,e,t,n,i,r){let o=s.geometry.attributes.position;if(So.fromBufferAttribute(o,i),Do.fromBufferAttribute(o,r),t.distanceSqToSegment(So,Do,Qa,Vu)>n)return;Qa.applyMatrix4(s.matrixWorld);let A=e.ray.origin.distanceTo(Qa);if(!(A<e.near||A>e.far))return{distance:A,point:Vu.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}var Hu=new b,ju=new b,Lo=class extends ys{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Hu.fromBufferAttribute(t,i),ju.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Hu.distanceTo(ju);e.setAttribute("lineDistance",new Mt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Ro=class extends ys{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},ur=class extends Xt{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Le(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Xu=new Re,tc=new Ri,no=new jt,io=new b,zo=class extends dt{constructor(e=new Nt,t=new ur){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),no.copy(n.boundingSphere),no.applyMatrix4(i),no.radius+=r,e.ray.intersectsSphere(no)===!1)return;Xu.copy(i).invert(),tc.copy(e.ray).applyMatrix4(Xu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),A=a*a,c=n.index,u=n.attributes.position;if(c!==null){let h=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let p=h,g=d;p<g;p++){let m=c.getX(p);io.fromBufferAttribute(u,m),Gu(io,m,A,i,e,t,this)}}else{let h=Math.max(0,o.start),d=Math.min(u.count,o.start+o.count);for(let p=h,g=d;p<g;p++)io.fromBufferAttribute(u,p),Gu(io,p,A,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Gu(s,e,t,n,i,r,o){let a=tc.distanceSqToPoint(s);if(a<t){let A=new b;tc.closestPointToPoint(s,A),A.applyMatrix4(n);let c=i.ray.origin.distanceTo(A);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:A,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var $t=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,i=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),i=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,A=r-1,c;for(;a<=A;)if(i=Math.floor(a+(A-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)A=i-1;else{A=i;break}if(i=A,n[i]===o)return i/(r-1);let l=n[i],h=n[i+1]-l,d=(o-l)/h;return(i+d)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),A=t||(o.isVector2?new re:new b);return A.copy(a).sub(o).normalize(),A}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new b,i=[],r=[],o=[],a=new b,A=new Re;for(let d=0;d<=e;d++){let p=d/e;i[d]=this.getTangentAt(p,new b)}r[0]=new b,o[0]=new b;let c=Number.MAX_VALUE,l=Math.abs(i[0].x),u=Math.abs(i[0].y),h=Math.abs(i[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),h<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(i[d-1],i[d]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(_t(i[d-1].dot(i[d]),-1,1));r[d].applyMatrix4(A.makeRotationAxis(a,p))}o[d].crossVectors(i[d],r[d])}if(t===!0){let d=Math.acos(_t(r[0].dot(r[e]),-1,1));d/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let p=1;p<=e;p++)r[p].applyMatrix4(A.makeRotationAxis(i[p],d*p)),o[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},hr=class extends $t{constructor(e=0,t=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,A=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=A}getPoint(e,t=new re){let n=t,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);let a=this.aStartAngle+e*r,A=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let l=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=A-this.aX,d=c-this.aY;A=h*l-d*u+this.aX,c=h*u+d*l+this.aY}return n.set(A,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},nc=class extends hr{constructor(e,t,n,i,r,o){super(e,t,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Zc(){let s=0,e=0,t=0,n=0;function i(r,o,a,A){s=r,e=a,t=-3*r+3*o-2*a-A,n=2*r-2*o+a+A}return{initCatmullRom:function(r,o,a,A,c){i(o,a,c*(a-r),c*(A-o))},initNonuniformCatmullRom:function(r,o,a,A,c,l,u){let h=(o-r)/c-(a-r)/(c+l)+(a-o)/l,d=(a-o)/l-(A-o)/(l+u)+(A-a)/u;h*=l,d*=l,i(o,a,h,d)},calc:function(r){let o=r*r,a=o*r;return s+e*r+t*o+n*a}}}var so=new b,Ja=new Zc,qa=new Zc,Ka=new Zc,ic=class extends $t{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new b){let n=t,i=this.points,r=i.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),A=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:A===0&&a===r-1&&(a=r-2,A=1);let c,l;this.closed||a>0?c=i[(a-1)%r]:(so.subVectors(i[0],i[1]).add(i[0]),c=so);let u=i[a%r],h=i[(a+1)%r];if(this.closed||a+2<r?l=i[(a+2)%r]:(so.subVectors(i[r-1],i[r-2]).add(i[r-1]),l=so),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(u),d),g=Math.pow(u.distanceToSquared(h),d),m=Math.pow(h.distanceToSquared(l),d);g<1e-4&&(g=1),p<1e-4&&(p=g),m<1e-4&&(m=g),Ja.initNonuniformCatmullRom(c.x,u.x,h.x,l.x,p,g,m),qa.initNonuniformCatmullRom(c.y,u.y,h.y,l.y,p,g,m),Ka.initNonuniformCatmullRom(c.z,u.z,h.z,l.z,p,g,m)}else this.curveType==="catmullrom"&&(Ja.initCatmullRom(c.x,u.x,h.x,l.x,this.tension),qa.initCatmullRom(c.y,u.y,h.y,l.y,this.tension),Ka.initCatmullRom(c.z,u.z,h.z,l.z,this.tension));return n.set(Ja.calc(A),qa.calc(A),Ka.calc(A)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new b().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Yu(s,e,t,n,i){let r=(n-e)*.5,o=(i-t)*.5,a=s*s,A=s*a;return(2*t-2*n+r+o)*A+(-3*t+3*n-2*r-o)*a+r*s+t}function _0(s,e){let t=1-s;return t*t*e}function T0(s,e){return 2*(1-s)*s*e}function I0(s,e){return s*s*e}function $s(s,e,t,n){return _0(s,e)+T0(s,t)+I0(s,n)}function P0(s,e){let t=1-s;return t*t*t*e}function b0(s,e){let t=1-s;return 3*t*t*s*e}function E0(s,e){return 3*(1-s)*s*s*e}function C0(s,e){return s*s*s*e}function er(s,e,t,n,i){return P0(s,e)+b0(s,t)+E0(s,n)+C0(s,i)}var No=class extends $t{constructor(e=new re,t=new re,n=new re,i=new re){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new re){let n=t,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(er(e,i.x,r.x,o.x,a.x),er(e,i.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},sc=class extends $t{constructor(e=new b,t=new b,n=new b,i=new b){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new b){let n=t,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(er(e,i.x,r.x,o.x,a.x),er(e,i.y,r.y,o.y,a.y),er(e,i.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Oo=class extends $t{constructor(e=new re,t=new re){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new re){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new re){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},rc=class extends $t{constructor(e=new b,t=new b){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new b){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new b){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Bo=class extends $t{constructor(e=new re,t=new re,n=new re){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new re){let n=t,i=this.v0,r=this.v1,o=this.v2;return n.set($s(e,i.x,r.x,o.x),$s(e,i.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},oc=class extends $t{constructor(e=new b,t=new b,n=new b){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new b){let n=t,i=this.v0,r=this.v1,o=this.v2;return n.set($s(e,i.x,r.x,o.x),$s(e,i.y,r.y,o.y),$s(e,i.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Uo=class extends $t{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new re){let n=t,i=this.points,r=(i.length-1)*e,o=Math.floor(r),a=r-o,A=i[o===0?o:o-1],c=i[o],l=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(Yu(a,A.x,c.x,l.x,u.x),Yu(a,A.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new re().fromArray(i))}return this}},ac=Object.freeze({__proto__:null,ArcCurve:nc,CatmullRomCurve3:ic,CubicBezierCurve:No,CubicBezierCurve3:sc,EllipseCurve:hr,LineCurve:Oo,LineCurve3:rc,QuadraticBezierCurve:Bo,QuadraticBezierCurve3:oc,SplineCurve:Uo}),Ac=class extends $t{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ac[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let o=i[r]-n,a=this.curves[r],A=a.getLength(),c=A===0?0:1-o/A;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let i=0,r=this.curves;i<r.length;i++){let o=r[i],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,A=o.getPoints(a);for(let c=0;c<A.length;c++){let l=A[c];n&&n.equals(l)||(t.push(l),n=l)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(new ac[i.type]().fromJSON(i))}return this}},Zo=class extends Ac{constructor(e){super(),this.type="Path",this.currentPoint=new re,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Oo(this.currentPoint.clone(),new re(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){let r=new Bo(this.currentPoint.clone(),new re(e,t),new re(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,o){let a=new No(this.currentPoint.clone(),new re(e,t),new re(n,i),new re(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Uo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,o){let a=this.currentPoint.x,A=this.currentPoint.y;return this.absarc(e+a,t+A,n,i,r,o),this}absarc(e,t,n,i,r,o){return this.absellipse(e,t,n,n,i,r,o),this}ellipse(e,t,n,i,r,o,a,A){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,i,r,o,a,A),this}absellipse(e,t,n,i,r,o,a,A){let c=new hr(e,t,n,i,r,o,a,A);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}};var _s=class s extends Nt{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,A=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:A};let c=this;i=Math.floor(i),r=Math.floor(r);let l=[],u=[],h=[],d=[],p=0,g=[],m=n/2,f=0;T(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(l),this.setAttribute("position",new Mt(u,3)),this.setAttribute("normal",new Mt(h,3)),this.setAttribute("uv",new Mt(d,2));function T(){let M=new b,R=new b,E=0,C=(t-e)/n;for(let D=0;D<=r;D++){let _=[],x=D/r,S=x*(t-e)+e;for(let V=0;V<=i;V++){let B=V/i,F=B*A+a,W=Math.sin(F),k=Math.cos(F);R.x=S*W,R.y=-x*n+m,R.z=S*k,u.push(R.x,R.y,R.z),M.set(W,C,k).normalize(),h.push(M.x,M.y,M.z),d.push(B,1-x),_.push(p++)}g.push(_)}for(let D=0;D<i;D++)for(let _=0;_<r;_++){let x=g[_][D],S=g[_+1][D],V=g[_+1][D+1],B=g[_][D+1];(e>0||_!==0)&&(l.push(x,S,B),E+=3),(t>0||_!==r-1)&&(l.push(S,V,B),E+=3)}c.addGroup(f,E,0),f+=E}function y(M){let R=p,E=new re,C=new b,D=0,_=M===!0?e:t,x=M===!0?1:-1;for(let V=1;V<=i;V++)u.push(0,m*x,0),h.push(0,x,0),d.push(.5,.5),p++;let S=p;for(let V=0;V<=i;V++){let F=V/i*A+a,W=Math.cos(F),k=Math.sin(F);C.x=_*k,C.y=m*x,C.z=_*W,u.push(C.x,C.y,C.z),h.push(0,x,0),E.x=W*.5+.5,E.y=k*.5*x+.5,d.push(E.x,E.y),p++}for(let V=0;V<i;V++){let B=R+V,F=S+V;M===!0?l.push(F,F+1,B):l.push(F+1,F,B),D+=3}c.addGroup(f,D,M===!0?1:2),f+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Ts=class extends Zo{constructor(e){super(e),this.uuid=qt(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(new Zo().fromJSON(i))}return this}},S0={triangulate:function(s,e,t=2){let n=e&&e.length,i=n?e[0]*t:s.length,r=Eh(s,0,i,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,A,c,l,u,h,d;if(n&&(r=N0(s,e,r,t)),s.length>80*t){a=c=s[0],A=l=s[1];for(let p=t;p<i;p+=t)u=s[p],h=s[p+1],u<a&&(a=u),h<A&&(A=h),u>c&&(c=u),h>l&&(l=h);d=Math.max(c-a,l-A),d=d!==0?32767/d:0}return dr(r,o,t,a,A,d,0),o}};function Eh(s,e,t,n,i){let r,o;if(i===G0(s,e,t,n)>0)for(r=e;r<t;r+=n)o=Wu(r,s[r],s[r+1],o);else for(r=t-n;r>=e;r-=n)o=Wu(r,s[r],s[r+1],o);return o&&ea(o,o.next)&&(pr(o),o=o.next),o}function Bi(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(ea(t,t.next)||ft(t.prev,t,t.next)===0)){if(pr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function dr(s,e,t,n,i,r,o){if(!s)return;!o&&r&&F0(s,n,i,r);let a=s,A,c;for(;s.prev!==s.next;){if(A=s.prev,c=s.next,r?L0(s,n,i,r):D0(s)){e.push(A.i/t|0),e.push(s.i/t|0),e.push(c.i/t|0),pr(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=R0(Bi(s),e,t),dr(s,e,t,n,i,r,2)):o===2&&z0(s,e,t,n,i,r):dr(Bi(s),e,t,n,i,r,1);break}}}function D0(s){let e=s.prev,t=s,n=s.next;if(ft(e,t,n)>=0)return!1;let i=e.x,r=t.x,o=n.x,a=e.y,A=t.y,c=n.y,l=i<r?i<o?i:o:r<o?r:o,u=a<A?a<c?a:c:A<c?A:c,h=i>r?i>o?i:o:r>o?r:o,d=a>A?a>c?a:c:A>c?A:c,p=n.next;for(;p!==e;){if(p.x>=l&&p.x<=h&&p.y>=u&&p.y<=d&&As(i,a,r,A,o,c,p.x,p.y)&&ft(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function L0(s,e,t,n){let i=s.prev,r=s,o=s.next;if(ft(i,r,o)>=0)return!1;let a=i.x,A=r.x,c=o.x,l=i.y,u=r.y,h=o.y,d=a<A?a<c?a:c:A<c?A:c,p=l<u?l<h?l:h:u<h?u:h,g=a>A?a>c?a:c:A>c?A:c,m=l>u?l>h?l:h:u>h?u:h,f=cc(d,p,e,t,n),T=cc(g,m,e,t,n),y=s.prevZ,M=s.nextZ;for(;y&&y.z>=f&&M&&M.z<=T;){if(y.x>=d&&y.x<=g&&y.y>=p&&y.y<=m&&y!==i&&y!==o&&As(a,l,A,u,c,h,y.x,y.y)&&ft(y.prev,y,y.next)>=0||(y=y.prevZ,M.x>=d&&M.x<=g&&M.y>=p&&M.y<=m&&M!==i&&M!==o&&As(a,l,A,u,c,h,M.x,M.y)&&ft(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;y&&y.z>=f;){if(y.x>=d&&y.x<=g&&y.y>=p&&y.y<=m&&y!==i&&y!==o&&As(a,l,A,u,c,h,y.x,y.y)&&ft(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;M&&M.z<=T;){if(M.x>=d&&M.x<=g&&M.y>=p&&M.y<=m&&M!==i&&M!==o&&As(a,l,A,u,c,h,M.x,M.y)&&ft(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function R0(s,e,t){let n=s;do{let i=n.prev,r=n.next.next;!ea(i,r)&&Ch(i,n,n.next,r)&&fr(i,r)&&fr(r,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),pr(n),pr(n.next),n=s=r),n=n.next}while(n!==s);return Bi(n)}function z0(s,e,t,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&H0(o,a)){let A=Sh(o,a);o=Bi(o,o.next),A=Bi(A,A.next),dr(o,e,t,n,i,r,0),dr(A,e,t,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function N0(s,e,t,n){let i=[],r,o,a,A,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,A=r<o-1?e[r+1]*n:s.length,c=Eh(s,a,A,n,!1),c===c.next&&(c.steiner=!0),i.push(V0(c));for(i.sort(O0),r=0;r<i.length;r++)t=B0(i[r],t);return t}function O0(s,e){return s.x-e.x}function B0(s,e){let t=U0(s,e);if(!t)return e;let n=Sh(t,s);return Bi(n,n.next),Bi(t,t.next)}function U0(s,e){let t=e,n=-1/0,i,r=s.x,o=s.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){let h=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=r&&h>n&&(n=h,i=t.x<t.next.x?t:t.next,h===r))return i}t=t.next}while(t!==e);if(!i)return null;let a=i,A=i.x,c=i.y,l=1/0,u;t=i;do r>=t.x&&t.x>=A&&r!==t.x&&As(o<c?r:n,o,A,c,o<c?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),fr(t,s)&&(u<l||u===l&&(t.x>i.x||t.x===i.x&&Z0(i,t)))&&(i=t,l=u)),t=t.next;while(t!==a);return i}function Z0(s,e){return ft(s.prev,s,e.prev)<0&&ft(e.next,s,s.next)<0}function F0(s,e,t,n){let i=s;do i.z===0&&(i.z=cc(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,k0(i)}function k0(s){let e,t,n,i,r,o,a,A,c=1;do{for(t=s,s=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(A=c;a>0||A>0&&n;)a!==0&&(A===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,a--):(i=n,n=n.nextZ,A--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;t=n}r.nextZ=null,c*=2}while(o>1);return s}function cc(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function V0(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function As(s,e,t,n,i,r,o,a){return(i-o)*(e-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(i-o)*(n-a)}function H0(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!j0(s,e)&&(fr(s,e)&&fr(e,s)&&X0(s,e)&&(ft(s.prev,s,e.prev)||ft(s,e.prev,e))||ea(s,e)&&ft(s.prev,s,s.next)>0&&ft(e.prev,e,e.next)>0)}function ft(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function ea(s,e){return s.x===e.x&&s.y===e.y}function Ch(s,e,t,n){let i=oo(ft(s,e,t)),r=oo(ft(s,e,n)),o=oo(ft(t,n,s)),a=oo(ft(t,n,e));return!!(i!==r&&o!==a||i===0&&ro(s,t,e)||r===0&&ro(s,n,e)||o===0&&ro(t,s,n)||a===0&&ro(t,e,n))}function ro(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function oo(s){return s>0?1:s<0?-1:0}function j0(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Ch(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function fr(s,e){return ft(s.prev,s,s.next)<0?ft(s,e,s.next)>=0&&ft(s,s.prev,e)>=0:ft(s,e,s.prev)<0||ft(s,s.next,e)<0}function X0(s,e){let t=s,n=!1,i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function Sh(s,e){let t=new lc(s.i,s.x,s.y),n=new lc(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Wu(s,e,t,n){let i=new lc(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function pr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function lc(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function G0(s,e,t,n){let i=0;for(let r=e,o=t-n;r<t;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var tr=class s{static area(e){let t=e.length,n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return s.area(e)<0}static triangulateShape(e,t){let n=[],i=[],r=[];Qu(e),Ju(n,e);let o=e.length;t.forEach(Qu);for(let A=0;A<t.length;A++)i.push(o),o+=t[A].length,Ju(n,t[A]);let a=S0.triangulate(n,i);for(let A=0;A<a.length;A+=3)r.push(a.slice(A,A+3));return r}};function Qu(s){let e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Ju(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}var mr=class s extends Nt{constructor(e=new Ts([new re(.5,.5),new re(-.5,.5),new re(-.5,-.5),new re(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,i=[],r=[];for(let a=0,A=e.length;a<A;a++){let c=e[a];o(c)}this.setAttribute("position",new Mt(i,3)),this.setAttribute("uv",new Mt(r,2)),this.computeVertexNormals();function o(a){let A=[],c=t.curveSegments!==void 0?t.curveSegments:12,l=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:d-.1,g=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,f=t.extrudePath,T=t.UVGenerator!==void 0?t.UVGenerator:Y0,y,M=!1,R,E,C,D;f&&(y=f.getSpacedPoints(l),M=!0,h=!1,R=f.computeFrenetFrames(l,!1),E=new b,C=new b,D=new b),h||(m=0,d=0,p=0,g=0);let _=a.extractPoints(c),x=_.shape,S=_.holes;if(!tr.isClockWise(x)){x=x.reverse();for(let J=0,te=S.length;J<te;J++){let P=S[J];tr.isClockWise(P)&&(S[J]=P.reverse())}}let B=tr.triangulateShape(x,S),F=x;for(let J=0,te=S.length;J<te;J++){let P=S[J];x=x.concat(P)}function W(J,te,P){return te||console.error("THREE.ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(te,P)}let k=x.length,ee=B.length;function H(J,te,P){let Pe,K,ge,oe=J.x-te.x,Ce=J.y-te.y,pe=P.x-J.x,I=P.y-J.y,v=oe*oe+Ce*Ce,O=oe*I-Ce*pe;if(Math.abs(O)>Number.EPSILON){let X=Math.sqrt(v),q=Math.sqrt(pe*pe+I*I),G=te.x-Ce/X,ye=te.y+oe/X,ce=P.x-I/q,me=P.y+pe/q,je=((ce-G)*I-(me-ye)*pe)/(oe*I-Ce*pe);Pe=G+oe*je-J.x,K=ye+Ce*je-J.y;let $=Pe*Pe+K*K;if($<=2)return new re(Pe,K);ge=Math.sqrt($/2)}else{let X=!1;oe>Number.EPSILON?pe>Number.EPSILON&&(X=!0):oe<-Number.EPSILON?pe<-Number.EPSILON&&(X=!0):Math.sign(Ce)===Math.sign(I)&&(X=!0),X?(Pe=-Ce,K=oe,ge=Math.sqrt(v)):(Pe=oe,K=Ce,ge=Math.sqrt(v/2))}return new re(Pe/ge,K/ge)}let ae=[];for(let J=0,te=F.length,P=te-1,Pe=J+1;J<te;J++,P++,Pe++)P===te&&(P=0),Pe===te&&(Pe=0),ae[J]=H(F[J],F[P],F[Pe]);let fe=[],xe,Be=ae.concat();for(let J=0,te=S.length;J<te;J++){let P=S[J];xe=[];for(let Pe=0,K=P.length,ge=K-1,oe=Pe+1;Pe<K;Pe++,ge++,oe++)ge===K&&(ge=0),oe===K&&(oe=0),xe[Pe]=H(P[Pe],P[ge],P[oe]);fe.push(xe),Be=Be.concat(xe)}for(let J=0;J<m;J++){let te=J/m,P=d*Math.cos(te*Math.PI/2),Pe=p*Math.sin(te*Math.PI/2)+g;for(let K=0,ge=F.length;K<ge;K++){let oe=W(F[K],ae[K],Pe);se(oe.x,oe.y,-P)}for(let K=0,ge=S.length;K<ge;K++){let oe=S[K];xe=fe[K];for(let Ce=0,pe=oe.length;Ce<pe;Ce++){let I=W(oe[Ce],xe[Ce],Pe);se(I.x,I.y,-P)}}}let $e=p+g;for(let J=0;J<k;J++){let te=h?W(x[J],Be[J],$e):x[J];M?(C.copy(R.normals[0]).multiplyScalar(te.x),E.copy(R.binormals[0]).multiplyScalar(te.y),D.copy(y[0]).add(C).add(E),se(D.x,D.y,D.z)):se(te.x,te.y,0)}for(let J=1;J<=l;J++)for(let te=0;te<k;te++){let P=h?W(x[te],Be[te],$e):x[te];M?(C.copy(R.normals[J]).multiplyScalar(P.x),E.copy(R.binormals[J]).multiplyScalar(P.y),D.copy(y[J]).add(C).add(E),se(D.x,D.y,D.z)):se(P.x,P.y,u/l*J)}for(let J=m-1;J>=0;J--){let te=J/m,P=d*Math.cos(te*Math.PI/2),Pe=p*Math.sin(te*Math.PI/2)+g;for(let K=0,ge=F.length;K<ge;K++){let oe=W(F[K],ae[K],Pe);se(oe.x,oe.y,u+P)}for(let K=0,ge=S.length;K<ge;K++){let oe=S[K];xe=fe[K];for(let Ce=0,pe=oe.length;Ce<pe;Ce++){let I=W(oe[Ce],xe[Ce],Pe);M?se(I.x,I.y+y[l-1].y,y[l-1].x+P):se(I.x,I.y,u+P)}}}Y(),ne();function Y(){let J=i.length/3;if(h){let te=0,P=k*te;for(let Pe=0;Pe<ee;Pe++){let K=B[Pe];Ee(K[2]+P,K[1]+P,K[0]+P)}te=l+m*2,P=k*te;for(let Pe=0;Pe<ee;Pe++){let K=B[Pe];Ee(K[0]+P,K[1]+P,K[2]+P)}}else{for(let te=0;te<ee;te++){let P=B[te];Ee(P[2],P[1],P[0])}for(let te=0;te<ee;te++){let P=B[te];Ee(P[0]+k*l,P[1]+k*l,P[2]+k*l)}}n.addGroup(J,i.length/3-J,0)}function ne(){let J=i.length/3,te=0;we(F,te),te+=F.length;for(let P=0,Pe=S.length;P<Pe;P++){let K=S[P];we(K,te),te+=K.length}n.addGroup(J,i.length/3-J,1)}function we(J,te){let P=J.length;for(;--P>=0;){let Pe=P,K=P-1;K<0&&(K=J.length-1);for(let ge=0,oe=l+m*2;ge<oe;ge++){let Ce=k*ge,pe=k*(ge+1),I=te+Pe+Ce,v=te+K+Ce,O=te+K+pe,X=te+Pe+pe;Ne(I,v,O,X)}}}function se(J,te,P){A.push(J),A.push(te),A.push(P)}function Ee(J,te,P){De(J),De(te),De(P);let Pe=i.length/3,K=T.generateTopUV(n,i,Pe-3,Pe-2,Pe-1);We(K[0]),We(K[1]),We(K[2])}function Ne(J,te,P,Pe){De(J),De(te),De(Pe),De(te),De(P),De(Pe);let K=i.length/3,ge=T.generateSideWallUV(n,i,K-6,K-3,K-2,K-1);We(ge[0]),We(ge[1]),We(ge[3]),We(ge[1]),We(ge[2]),We(ge[3])}function De(J){i.push(A[J*3+0]),i.push(A[J*3+1]),i.push(A[J*3+2])}function We(J){r.push(J.x),r.push(J.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return W0(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new ac[i.type]().fromJSON(i)),new s(n,e.options)}},Y0={generateTopUV:function(s,e,t,n,i){let r=e[t*3],o=e[t*3+1],a=e[n*3],A=e[n*3+1],c=e[i*3],l=e[i*3+1];return[new re(r,o),new re(a,A),new re(c,l)]},generateSideWallUV:function(s,e,t,n,i,r){let o=e[t*3],a=e[t*3+1],A=e[t*3+2],c=e[n*3],l=e[n*3+1],u=e[n*3+2],h=e[i*3],d=e[i*3+1],p=e[i*3+2],g=e[r*3],m=e[r*3+1],f=e[r*3+2];return Math.abs(a-l)<Math.abs(o-c)?[new re(o,1-A),new re(c,1-u),new re(h,1-p),new re(g,1-f)]:[new re(a,1-A),new re(l,1-u),new re(d,1-p),new re(m,1-f)]}};function W0(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var gr=class s extends Nt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let A=Math.min(o+a,Math.PI),c=0,l=[],u=new b,h=new b,d=[],p=[],g=[],m=[];for(let f=0;f<=n;f++){let T=[],y=f/n,M=0;f===0&&o===0?M=.5/t:f===n&&A===Math.PI&&(M=-.5/t);for(let R=0;R<=t;R++){let E=R/t;u.x=-e*Math.cos(i+E*r)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(i+E*r)*Math.sin(o+y*a),p.push(u.x,u.y,u.z),h.copy(u).normalize(),g.push(h.x,h.y,h.z),m.push(E+M,1-y),T.push(c++)}l.push(T)}for(let f=0;f<n;f++)for(let T=0;T<t;T++){let y=l[f][T+1],M=l[f][T],R=l[f+1][T],E=l[f+1][T+1];(f!==0||o>0)&&d.push(y,M,E),(f!==n-1||A<Math.PI)&&d.push(M,R,E)}this.setIndex(d),this.setAttribute("position",new Mt(p,3)),this.setAttribute("normal",new Mt(g,3)),this.setAttribute("uv",new Mt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var li=class extends Xt{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Le(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=gh,this.normalScale=new re(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Yt=class extends li{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new re(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return _t(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Le(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Le(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Le(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};function ao(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Q0(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function J0(s){function e(i,r){return s[i]-s[r]}let t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function qu(s,e,t){let n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let A=0;A!==e;++A)i[o++]=s[a+A]}return i}function Dh(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push.apply(t,o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}var ui=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break t}o=t.length;break n}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let A=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===A)break;if(i=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},uc=class extends ui{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:rs,endingEnd:rs}}intervalChanged_(e,t,n){let i=this.parameterPositions,r=e-2,o=e+1,a=i[r],A=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case os:r=e,a=2*t-n;break;case fo:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(A===void 0)switch(this.getSettings_().endingEnd){case os:o=e,A=2*n-t;break;case fo:o=1,A=n+i[1]-i[0];break;default:o=e-1,A=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(A-n),this._offsetPrev=r*l,this._offsetNext=o*l}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,A=e*a,c=A-a,l=this._offsetPrev,u=this._offsetNext,h=this._weightPrev,d=this._weightNext,p=(n-t)/(i-t),g=p*p,m=g*p,f=-h*m+2*h*g-h*p,T=(1+h)*m+(-1.5-2*h)*g+(-.5+h)*p+1,y=(-1-d)*m+(1.5+d)*g+.5*p,M=d*m-d*g;for(let R=0;R!==a;++R)r[R]=f*o[l+R]+T*o[c+R]+y*o[A+R]+M*o[u+R];return r}},Fo=class extends ui{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,A=e*a,c=A-a,l=(n-t)/(i-t),u=1-l;for(let h=0;h!==a;++h)r[h]=o[c+h]*u+o[A+h]*l;return r}},hc=class extends ui{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},en=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ao(t,this.TimeBufferType),this.values=ao(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ao(e.times,Array),values:ao(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new hc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Fo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new uc(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ms:t=this.InterpolantFactoryMethodDiscrete;break;case vs:t=this.InterpolantFactoryMethodLinear;break;case xa:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ms;case this.InterpolantFactoryMethodLinear:return vs;case this.InterpolantFactoryMethodSmooth:return xa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let A=n[a];if(typeof A=="number"&&isNaN(A)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,A),e=!1;break}if(o!==null&&o>A){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,A,o),e=!1;break}o=A}if(i!==void 0&&Q0(i))for(let a=0,A=i.length;a!==A;++a){let c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===xa,r=e.length-1,o=1;for(let a=1;a<r;++a){let A=!1,c=e[a],l=e[a+1];if(c!==l&&(a!==1||c!==e[0]))if(i)A=!0;else{let u=a*n,h=u-n,d=u+n;for(let p=0;p!==n;++p){let g=t[u+p];if(g!==t[h+p]||g!==t[d+p]){A=!0;break}}}if(A){if(a!==o){e[o]=e[a];let u=a*n,h=o*n;for(let d=0;d!==n;++d)t[h+d]=t[u+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,A=o*n,c=0;c!==n;++c)t[A+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};en.prototype.TimeBufferType=Float32Array;en.prototype.ValueBufferType=Float32Array;en.prototype.DefaultInterpolation=vs;var hi=class extends en{constructor(e,t,n){super(e,t,n)}};hi.prototype.ValueTypeName="bool";hi.prototype.ValueBufferType=Array;hi.prototype.DefaultInterpolation=Ms;hi.prototype.InterpolantFactoryMethodLinear=void 0;hi.prototype.InterpolantFactoryMethodSmooth=void 0;var ko=class extends en{};ko.prototype.ValueTypeName="color";var kn=class extends en{};kn.prototype.ValueTypeName="number";var dc=class extends ui{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,A=(n-t)/(i-t),c=e*a;for(let l=c+a;c!==l;c+=4)Ft.slerpFlat(r,0,o,c-a,o,c,A);return r}},Vn=class extends en{InterpolantFactoryMethodLinear(e){return new dc(this.times,this.values,this.getValueSize(),e)}};Vn.prototype.ValueTypeName="quaternion";Vn.prototype.InterpolantFactoryMethodSmooth=void 0;var di=class extends en{constructor(e,t,n){super(e,t,n)}};di.prototype.ValueTypeName="string";di.prototype.ValueBufferType=Array;di.prototype.DefaultInterpolation=Ms;di.prototype.InterpolantFactoryMethodLinear=void 0;di.prototype.InterpolantFactoryMethodSmooth=void 0;var Hn=class extends en{};Hn.prototype.ValueTypeName="vector";var Is=class{constructor(e="",t=-1,n=[],i=Oc){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=qt(),this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(K0(n[o]).scale(i));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,o=n.length;r!==o;++r)t.push(en.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let r=t.length,o=[];for(let a=0;a<r;a++){let A=[],c=[];A.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let l=J0(A);A=qu(A,1,l),c=qu(c,1,l),!i&&A[0]===0&&(A.push(r),c.push(c[0])),o.push(new kn(".morphTargetInfluences["+t[a].name+"]",A,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,A=e.length;a<A;a++){let c=e[a],l=c.name.match(r);if(l&&l.length>1){let u=l[1],h=i[u];h||(i[u]=h=[]),h.push(c)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(u,h,d,p,g){if(d.length!==0){let m=[],f=[];Dh(d,m,f,p),m.length!==0&&g.push(new u(h,m,f))}},i=[],r=e.name||"default",o=e.fps||30,a=e.blendMode,A=e.length||-1,c=e.hierarchy||[];for(let u=0;u<c.length;u++){let h=c[u].keys;if(!(!h||h.length===0))if(h[0].morphTargets){let d={},p;for(p=0;p<h.length;p++)if(h[p].morphTargets)for(let g=0;g<h[p].morphTargets.length;g++)d[h[p].morphTargets[g]]=-1;for(let g in d){let m=[],f=[];for(let T=0;T!==h[p].morphTargets.length;++T){let y=h[p];m.push(y.time),f.push(y.morphTarget===g?1:0)}i.push(new kn(".morphTargetInfluence["+g+"]",m,f))}A=d.length*o}else{let d=".bones["+t[u].name+"]";n(Hn,d+".position",h,"pos",i),n(Vn,d+".quaternion",h,"rot",i),n(Hn,d+".scale",h,"scl",i)}}return i.length===0?null:new this(r,A,i,a)}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function q0(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return kn;case"vector":case"vector2":case"vector3":case"vector4":return Hn;case"color":return ko;case"quaternion":return Vn;case"bool":case"boolean":return hi;case"string":return di}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function K0(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=q0(s.type);if(s.times===void 0){let t=[],n=[];Dh(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}var oi={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}},Mr=class{constructor(e,t,n){let i=this,r=!1,o=0,a=0,A,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(l){a++,r===!1&&i.onStart!==void 0&&i.onStart(l,o,a),r=!0},this.itemEnd=function(l){o++,i.onProgress!==void 0&&i.onProgress(l,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(l){i.onError!==void 0&&i.onError(l)},this.resolveURL=function(l){return A?A(l):l},this.setURLModifier=function(l){return A=l,this},this.addHandler=function(l,u){return c.push(l,u),this},this.removeHandler=function(l){let u=c.indexOf(l);return u!==-1&&c.splice(u,2),this},this.getHandler=function(l){for(let u=0,h=c.length;u<h;u+=2){let d=c[u],p=c[u+1];if(d.global&&(d.lastIndex=0),d.test(l))return p}return null}}},$0=new Mr,jn=class{constructor(e){this.manager=e!==void 0?e:$0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};jn.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ln={},fc=class extends Error{constructor(e,t){super(e),this.response=t}},vr=class extends jn{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=oi.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Ln[e]!==void 0){Ln[e].push({onLoad:t,onProgress:n,onError:i});return}Ln[e]=[],Ln[e].push({onLoad:t,onProgress:n,onError:i});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,A=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let l=Ln[e],u=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=h?parseInt(h):0,p=d!==0,g=0,m=new ReadableStream({start(f){T();function T(){u.read().then(({done:y,value:M})=>{if(y)f.close();else{g+=M.byteLength;let R=new ProgressEvent("progress",{lengthComputable:p,loaded:g,total:d});for(let E=0,C=l.length;E<C;E++){let D=l[E];D.onProgress&&D.onProgress(R)}f.enqueue(M),T()}},y=>{f.error(y)})}}});return new Response(m)}else throw new fc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(A){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(l=>new DOMParser().parseFromString(l,a));case"json":return c.json();default:if(a===void 0)return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),h=u&&u[1]?u[1].toLowerCase():void 0,d=new TextDecoder(h);return c.arrayBuffer().then(p=>d.decode(p))}}}).then(c=>{oi.add(e,c);let l=Ln[e];delete Ln[e];for(let u=0,h=l.length;u<h;u++){let d=l[u];d.onLoad&&d.onLoad(c)}}).catch(c=>{let l=Ln[e];if(l===void 0)throw this.manager.itemError(e),c;delete Ln[e];for(let u=0,h=l.length;u<h;u++){let d=l[u];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}};var pc=class extends jn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=oi.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;let a=sr("img");function A(){l(),oi.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(u){l(),i&&i(u),r.manager.itemError(e),r.manager.itemEnd(e)}function l(){a.removeEventListener("load",A,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",A,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}};var Vo=class extends jn{constructor(e){super(e)}load(e,t,n,i){let r=new It,o=new pc(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}},Ps=class extends dt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Le(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Ho=class extends Ps{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(dt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Le(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},$a=new Re,Ku=new b,$u=new b,xr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new re(512,512),this.map=null,this.mapPass=null,this.matrix=new Re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new or,this._frameExtents=new re(1,1),this._viewportCount=1,this._viewports=[new Ke(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Ku.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ku),$u.setFromMatrixPosition(e.target.matrixWorld),t.lookAt($u),t.updateMatrixWorld(),$a.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix($a),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply($a)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},mc=class extends xr{constructor(){super(new Tt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=xs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},jo=class extends Ps{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(dt.DEFAULT_UP),this.updateMatrix(),this.target=new dt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new mc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},eh=new Re,Gs=new b,eA=new b,gc=class extends xr{constructor(){super(new Tt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new re(4,2),this._viewportCount=6,this._viewports=[new Ke(2,1,1,1),new Ke(0,1,1,1),new Ke(3,1,1,1),new Ke(1,1,1,1),new Ke(3,0,1,1),new Ke(1,0,1,1)],this._cubeDirections=[new b(1,0,0),new b(-1,0,0),new b(0,0,1),new b(0,0,-1),new b(0,1,0),new b(0,-1,0)],this._cubeUps=[new b(0,1,0),new b(0,1,0),new b(0,1,0),new b(0,1,0),new b(0,0,1),new b(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Gs.setFromMatrixPosition(e.matrixWorld),n.position.copy(Gs),eA.copy(n.position),eA.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(eA),n.updateMatrixWorld(),i.makeTranslation(-Gs.x,-Gs.y,-Gs.z),eh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(eh)}},Xo=class extends Ps{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new gc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Mc=class extends xr{constructor(){super(new ci(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ui=class extends Ps{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(dt.DEFAULT_UP),this.updateMatrix(),this.target=new dt,this.shadow=new Mc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var fi=class{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Go=class extends jn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=oi.get(e);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{t&&t(c),r.manager.itemEnd(e)}).catch(c=>{i&&i(c)});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;let A=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return oi.add(e,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),oi.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});oi.add(e,A),r.manager.itemStart(e)}};var Yo=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=th(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=th();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};function th(){return performance.now()}var vc=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,o;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,r=e*i+i,o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[r+a]=n[a];o=t}else{o+=t;let a=t/o;this._mixBufferRegion(n,r,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let A=t*this._origIndex;this._mixBufferRegion(n,i,A,1-r,t)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let A=t,c=t+t;A!==c;++A)if(n[A]!==n[A+t]){a.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,o=i;r!==o;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let o=0;o!==r;++o)e[t+o]=e[n+o]}_slerp(e,t,n,i){Ft.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){let o=this._workIndex*r;Ft.multiplyQuaternionsFlat(e,o,e,t,e,n),Ft.slerpFlat(e,t,e,t,e,o,i)}_lerp(e,t,n,i,r){let o=1-i;for(let a=0;a!==r;++a){let A=t+a;e[A]=e[A]*o+e[n+a]*i}}_lerpAdditive(e,t,n,i,r){for(let o=0;o!==r;++o){let a=t+o;e[a]=e[a]+e[n+o]*i}}},Fc="\\[\\]\\.:\\/",ev=new RegExp("["+Fc+"]","g"),kc="[^"+Fc+"]",tv="[^"+Fc.replace("\\.","")+"]",nv=/((?:WC+[\/:])*)/.source.replace("WC",kc),iv=/(WCOD+)?/.source.replace("WCOD",tv),sv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",kc),rv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",kc),ov=new RegExp("^"+nv+iv+sv+rv+"$"),av=["material","materials","bones","map"],xc=class{constructor(e,t,n){let i=n||at.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},at=class s{constructor(e,t,n){this.path=t,this.parsedPath=n||s.parseTrackName(t),this.node=s.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new s.Composite(e,t,n):new s(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ev,"")}static parseTrackName(e){let t=ov.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);av.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let A=n(a.children);if(A)return A}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,r=t.propertyIndex;if(e||(e=s.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let l=0;l<e.length;l++)if(e[l].name===c){c=l;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[i];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let A=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}A=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(A=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(A=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[A],this.setValue=this.SetterByBindingTypeAndVersioning[A][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};at.Composite=xc;at.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};at.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};at.prototype.GetterByBindingType=[at.prototype._getValue_direct,at.prototype._getValue_array,at.prototype._getValue_arrayElement,at.prototype._getValue_toArray];at.prototype.SetterByBindingTypeAndVersioning=[[at.prototype._setValue_direct,at.prototype._setValue_direct_setNeedsUpdate,at.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[at.prototype._setValue_array,at.prototype._setValue_array_setNeedsUpdate,at.prototype._setValue_array_setMatrixWorldNeedsUpdate],[at.prototype._setValue_arrayElement,at.prototype._setValue_arrayElement_setNeedsUpdate,at.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[at.prototype._setValue_fromArray,at.prototype._setValue_fromArray_setNeedsUpdate,at.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var wc=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let r=t.tracks,o=r.length,a=new Array(o),A={endingStart:rs,endingEnd:rs};for(let c=0;c!==o;++c){let l=r[c].createInterpolant(null);a[c]=l,l.settings=A}this._interpolantSettings=A,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Nc,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){let i=this._clip.duration,r=e._clip.duration,o=r/i,a=i/r;e.warp(1,o,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,r=i.time,o=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let A=a.parameterPositions,c=a.sampleValues;return A[0]=r,A[1]=r+n,c[0]=e/o,c[1]=t/o,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let r=this._startTime;if(r!==null){let A=(e-r)*n;A<0||n===0?t=0:(this._startTime=null,t=n*A)}t*=this._updateTimeScale(e);let o=this._updateTime(t),a=this._updateWeight(e);if(a>0){let A=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Qd:for(let l=0,u=A.length;l!==u;++l)A[l].evaluate(o),c[l].accumulateAdditive(a);break;case Oc:default:for(let l=0,u=A.length;l!==u;++l)A[l].evaluate(o),c[l].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,r=this._loopCount,o=n===Wd;if(e===0)return r===-1?i:o&&(r&1)===1?t-i:i;if(n===zc){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=t||i<0){let a=Math.floor(i/t);i-=t*a,r+=Math.abs(a);let A=this.repetitions-r;if(A<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(A===1){let c=e<0;this._setEndings(c,!c,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=os,i.endingEnd=os):(e?i.endingStart=this.zeroSlopeAtStart?os:rs:i.endingStart=fo,t?i.endingEnd=this.zeroSlopeAtEnd?os:rs:i.endingEnd=fo)}_scheduleFading(e,t,n){let i=this._mixer,r=i.time,o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);let a=o.parameterPositions,A=o.sampleValues;return a[0]=r,A[0]=t,a[1]=r+e,A[1]=n,this}},Av=new Float32Array(1),Wo=class extends Zn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,o=e._propertyBindings,a=e._interpolants,A=n.uuid,c=this._bindingsByRootAndName,l=c[A];l===void 0&&(l={},c[A]=l);for(let u=0;u!==r;++u){let h=i[u],d=h.name,p=l[d];if(p!==void 0)++p.referenceCount,o[u]=p;else{if(p=o[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,A,d));continue}let g=t&&t._propertyBindings[u].binding.parsedPath;p=new vc(at.create(n,d,g),h.ValueTypeName,h.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,A,d),o[u]=p}a[u].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,r=this._actionsByClip,o=r[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=o;else{let a=o.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let r=e._clip.uuid,o=this._actionsByClip,a=o[r],A=a.knownActions,c=A[A.length-1],l=e._byClipCacheIndex;c._byClipCacheIndex=l,A[l]=c,A.pop(),e._byClipCacheIndex=null;let u=a.actionByRoot,h=(e._localRoot||this._root).uuid;delete u[h],A.length===0&&delete o[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,r=this._bindings,o=i[t];o===void 0&&(o={},i[t]=o),o[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,a=o[i],A=t[t.length-1],c=e._cacheIndex;A._cacheIndex=c,t[c]=A,t.pop(),delete a[r],Object.keys(a).length===0&&delete o[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new Fo(new Float32Array(2),new Float32Array(2),1,Av),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){let i=t||this._root,r=i.uuid,o=typeof e=="string"?Is.findByName(i,e):e,a=o!==null?o.uuid:e,A=this._actionsByClip[a],c=null;if(n===void 0&&(o!==null?n=o.blendMode:n=Oc),A!==void 0){let u=A.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=A.knownActions[0],o===null&&(o=c._clip)}if(o===null)return null;let l=new wc(this,o,t,n);return this._bindAction(l,c),this._addInactiveAction(l,a,r),l}existingAction(e,t){let n=t||this._root,i=n.uuid,r=typeof e=="string"?Is.findByName(n,e):e,o=r?r.uuid:e,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),o=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,o);let a=this._bindings,A=this._nActiveBindings;for(let c=0;c!==A;++c)a[c].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){let o=r.knownActions;for(let a=0,A=o.length;a!==A;++a){let c=o[a];this._deactivateAction(c);let l=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=l,t[l]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let o in n){let a=n[o].actionByRoot,A=a[t];A!==void 0&&(this._deactivateAction(A),this._removeInactiveAction(A))}let i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(let o in r){let a=r[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var nh=new Re,Qo=class{constructor(e,t,n=0,i=1/0){this.ray=new Ri(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new rr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return nh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(nh),this}intersectObject(e,t=!0,n=[]){return yc(e,this,n,t),n.sort(ih),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)yc(e[i],this,n,t);return n.sort(ih),n}};function ih(s,e){return s.distance-e.distance}function yc(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let r=s.children;for(let o=0,a=r.length;o<a;o++)yc(r[o],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_c}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_c);function Vc(s,e){if(e===mh)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===yr||e===qo){let t=s.getIndex();if(t===null){let o=[],a=s.getAttribute("position");if(a!==void 0){for(let A=0;A<a.count;A++)o.push(A);s.setIndex(o),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}let n=t.count-2,i=[];if(e===yr)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}var ta=class extends jn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Qc(t)}),this.register(function(t){return new Jc(t)}),this.register(function(t){return new rl(t)}),this.register(function(t){return new ol(t)}),this.register(function(t){return new al(t)}),this.register(function(t){return new Kc(t)}),this.register(function(t){return new $c(t)}),this.register(function(t){return new el(t)}),this.register(function(t){return new tl(t)}),this.register(function(t){return new Wc(t)}),this.register(function(t){return new nl(t)}),this.register(function(t){return new qc(t)}),this.register(function(t){return new sl(t)}),this.register(function(t){return new il(t)}),this.register(function(t){return new Gc(t)}),this.register(function(t){return new Al(t)}),this.register(function(t){return new cl(t)})}load(e,t,n,i){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=fi.extractUrlBase(e);o=fi.resolveURL(c,this.path)}else o=fi.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},A=new vr(this.manager);A.setPath(this.path),A.setResponseType("arraybuffer"),A.setRequestHeader(this.requestHeader),A.setWithCredentials(this.withCredentials),A.load(e,function(c){try{r.parse(c,o,function(l){t(l),r.manager.itemEnd(e)},a)}catch(l){a(l)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r,o={},a={},A=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(A.decode(new Uint8Array(e,0,4))===Oh){try{o[He.KHR_BINARY_GLTF]=new ll(e)}catch(u){i&&i(u);return}r=JSON.parse(o[He.KHR_BINARY_GLTF].content)}else r=JSON.parse(A.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new gl(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let l=0;l<this.pluginCallbacks.length;l++){let u=this.pluginCallbacks[l](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(r.extensionsUsed)for(let l=0;l<r.extensionsUsed.length;++l){let u=r.extensionsUsed[l],h=r.extensionsRequired||[];switch(u){case He.KHR_MATERIALS_UNLIT:o[u]=new Yc;break;case He.KHR_DRACO_MESH_COMPRESSION:o[u]=new ul(r,this.dracoLoader);break;case He.KHR_TEXTURE_TRANSFORM:o[u]=new hl;break;case He.KHR_MESH_QUANTIZATION:o[u]=new dl;break;default:h.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}};function lv(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}var He={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Gc=class{constructor(e){this.parser=e,this.name=He.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let r=t.json,A=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,l=new Le(16777215);A.color!==void 0&&l.setRGB(A.color[0],A.color[1],A.color[2],Dt);let u=A.range!==void 0?A.range:0;switch(A.type){case"directional":c=new Ui(l),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Xo(l),c.distance=u;break;case"spot":c=new jo(l),c.distance=u,A.spot=A.spot||{},A.spot.innerConeAngle=A.spot.innerConeAngle!==void 0?A.spot.innerConeAngle:0,A.spot.outerConeAngle=A.spot.outerConeAngle!==void 0?A.spot.outerConeAngle:Math.PI/4,c.angle=A.spot.outerConeAngle,c.penumbra=1-A.spot.innerConeAngle/A.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+A.type)}return c.position.set(0,0,0),c.decay=2,Xn(c,A),A.intensity!==void 0&&(c.intensity=A.intensity),c.name=t.createUniqueName(A.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(A){return n._getNodeRef(t.cache,a,A)})}},Yc=class{constructor(){this.name=He.KHR_MATERIALS_UNLIT}getMaterialType(){return Gt}extendParams(e,t,n){let i=[];e.color=new Le(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Dt),e.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,gt))}return Promise.all(i)}},Wc=class{constructor(e){this.parser=e,this.name=He.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},Qc=class{constructor(e){this.parser=e,this.name=He.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Yt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new re(a,a)}return Promise.all(r)}},Jc=class{constructor(e){this.parser=e,this.name=He.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Yt}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}},qc=class{constructor(e){this.parser=e,this.name=He.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Yt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}},Kc=class{constructor(e){this.parser=e,this.name=He.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Yt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[];t.sheenColor=new Le(0,0,0),t.sheenRoughness=0,t.sheen=1;let o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Dt)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,gt)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}},$c=class{constructor(e){this.parser=e,this.name=He.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Yt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(r)}},el=class{constructor(e){this.parser=e,this.name=He.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Yt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return t.attenuationColor=new Le().setRGB(a[0],a[1],a[2],Dt),Promise.all(r)}},tl=class{constructor(e){this.parser=e,this.name=He.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Yt}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}},nl=class{constructor(e){this.parser=e,this.name=He.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Yt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return t.specularColor=new Le().setRGB(a[0],a[1],a[2],Dt),o.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,gt)),Promise.all(r)}},il=class{constructor(e){this.parser=e,this.name=He.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Yt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(r)}},sl=class{constructor(e){this.parser=e,this.name=He.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Yt}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}},rl=class{constructor(e){this.parser=e,this.name=He.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let r=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},ol=class{constructor(e){this.parser=e,this.name=He.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=i.images[o.source],A=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(A=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,o.source,A);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){let t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}},al=class{constructor(e){this.parser=e,this.name=He.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=i.images[o.source],A=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(A=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,o.source,A);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){let t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}},Al=class{constructor(e){this.name=He.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let A=i.byteOffset||0,c=i.byteLength||0,l=i.count,u=i.byteStride,h=new Uint8Array(a,A,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(l,u,h,i.mode,i.filter).then(function(d){return d.buffer}):o.ready.then(function(){let d=new ArrayBuffer(l*u);return o.decodeGltfBuffer(new Uint8Array(d),l,u,h,i.mode,i.filter),d})})}else return null}},cl=class{constructor(e){this.name=He.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==tn.TRIANGLES&&c.mode!==tn.TRIANGLE_STRIP&&c.mode!==tn.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],A={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(l=>(A[c]=l,A[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let l=c.pop(),u=l.isGroup?l.children:[l],h=c[0].count,d=[];for(let p of u){let g=new Re,m=new b,f=new Ft,T=new b(1,1,1),y=new Co(p.geometry,p.material,h);for(let M=0;M<h;M++)A.TRANSLATION&&m.fromBufferAttribute(A.TRANSLATION,M),A.ROTATION&&f.fromBufferAttribute(A.ROTATION,M),A.SCALE&&T.fromBufferAttribute(A.SCALE,M),y.setMatrixAt(M,g.compose(m,f,T));for(let M in A)if(M==="_COLOR_0"){let R=A[M];y.instanceColor=new Oi(R.array,R.itemSize,R.normalized)}else M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"&&p.geometry.setAttribute(M,A[M]);dt.prototype.copy.call(y,p),this.parser.assignFinalMaterial(y),d.push(y)}return l.isGroup?(l.clear(),l.add(...d),l):d[0]}))}},Oh="glTF",_r=12,Lh={JSON:1313821514,BIN:5130562},ll=class{constructor(e){this.name=He.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,_r),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Oh)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-_r,r=new DataView(e,_r),o=0;for(;o<i;){let a=r.getUint32(o,!0);o+=4;let A=r.getUint32(o,!0);if(o+=4,A===Lh.JSON){let c=new Uint8Array(e,_r+o,a);this.content=n.decode(c)}else if(A===Lh.BIN){let c=_r+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},ul=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=He.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},A={},c={};for(let l in o){let u=pl[l]||l.toLowerCase();a[u]=o[l]}for(let l in e.attributes){let u=pl[l]||l.toLowerCase();if(o[l]!==void 0){let h=n.accessors[e.attributes[l]],d=Es[h.componentType];c[u]=d.name,A[u]=h.normalized===!0}}return t.getDependency("bufferView",r).then(function(l){return new Promise(function(u,h){i.decodeDracoFile(l,function(d){for(let p in d.attributes){let g=d.attributes[p],m=A[p];m!==void 0&&(g.normalized=m)}u(d)},a,c,Dt,h)})})}},hl=class{constructor(){this.name=He.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},dl=class{constructor(){this.name=He.KHR_MESH_QUANTIZATION}},na=class extends ui{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,A=a*2,c=a*3,l=i-t,u=(n-t)/l,h=u*u,d=h*u,p=e*c,g=p-c,m=-2*d+3*h,f=d-h,T=1-m,y=f-h+u;for(let M=0;M!==a;M++){let R=o[g+M+a],E=o[g+M+A]*l,C=o[p+M+a],D=o[p+M]*l;r[M]=T*R+y*E+m*C+f*D}return r}},uv=new Ft,fl=class extends na{interpolate_(e,t,n,i){let r=super.interpolate_(e,t,n,i);return uv.fromArray(r).normalize().toArray(r),r}},tn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Es={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Rh={9728:St,9729:Ut,9984:Pc,9985:Qs,9986:ss,9987:gn},zh={33071:Nn,33648:nr,10497:Di},Hc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},pl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},pi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},hv={CUBICSPLINE:void 0,LINEAR:vs,STEP:Ms},jc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function dv(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new li({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Mn})),s.DefaultMaterial}function Zi(s,e,t){for(let n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Xn(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function fv(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,l=e.length;c<l;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);let o=[],a=[],A=[];for(let c=0,l=e.length;c<l;c++){let u=e[c];if(n){let h=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;o.push(h)}if(i){let h=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;a.push(h)}if(r){let h=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;A.push(h)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(A)]).then(function(c){let l=c[0],u=c[1],h=c[2];return n&&(s.morphAttributes.position=l),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=h),s.morphTargetsRelative=!0,s})}function pv(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function mv(s){let e,t=s.extensions&&s.extensions[He.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Xc(t.attributes):e=s.indices+":"+Xc(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+Xc(s.targets[n]);return e}function Xc(s){let e="",t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function ml(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function gv(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var Mv=new Re,gl=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new lv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let A=a.match(/Version\/(\d+)/);i=n&&A?parseInt(A[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&o<98?this.textureLoader=new Vo(this.options.manager):this.textureLoader=new Go(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new vr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return Zi(r,a,i),Xn(a,i),Promise.all(n._invokeAll(function(A){return A.afterRoot&&A.afterRoot(a)})).then(function(){for(let A of a.scenes)A.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){let o=t[i].joints;for(let a=0,A=o.length;a<A;a++)e[o[a]].isBone=!0}for(let i=0,r=e.length;i<r;i++){let o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),r=(o,a)=>{let A=this.associations.get(o);A!=null&&this.associations.set(a,A);for(let[c,l]of o.children.entries())r(l,a.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[He.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(r,o){n.load(fi.resolveURL(t.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let o=Hc[i.type],a=Es[i.componentType],A=i.normalized===!0,c=new a(i.count*o);return Promise.resolve(new vt(c,o,A))}let r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],A=Hc[i.type],c=Es[i.componentType],l=c.BYTES_PER_ELEMENT,u=l*A,h=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,g,m;if(d&&d!==u){let f=Math.floor(h/d),T="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+f+":"+i.count,y=t.cache.get(T);y||(g=new c(a,f*d,i.count*d/l),y=new ar(g,d/l),t.cache.add(T,y)),m=new Ar(y,A,h%d/l,p)}else a===null?g=new c(i.count*A):g=new c(a,h,i.count*A),m=new vt(g,A,p);if(i.sparse!==void 0){let f=Hc.SCALAR,T=Es[i.sparse.indices.componentType],y=i.sparse.indices.byteOffset||0,M=i.sparse.values.byteOffset||0,R=new T(o[1],y,i.sparse.count*f),E=new c(o[2],M,i.sparse.count*A);a!==null&&(m=new vt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let C=0,D=R.length;C<D;C++){let _=R[C];if(m.setX(_,E[C*A]),A>=2&&m.setY(_,E[C*A+1]),A>=3&&m.setZ(_,E[C*A+2]),A>=4&&m.setW(_,E[C*A+3]),A>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let A=n.manager.getHandler(o.uri);A!==null&&(a=A)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let i=this,r=this.json,o=r.textures[e],a=r.images[t],A=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[A])return this.textureCache[A];let c=this.loadImageSource(t,n).then(function(l){l.flipY=!1,l.name=o.name||a.name||"",l.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(l.name=a.uri);let h=(r.samplers||{})[o.sampler]||{};return l.magFilter=Rh[h.magFilter]||Ut,l.minFilter=Rh[h.minFilter]||gn,l.wrapS=zh[h.wrapS]||Di,l.wrapT=zh[h.wrapT]||Di,l.generateMipmaps=!l.isCompressedTexture&&l.minFilter!==St&&l.minFilter!==Ut,i.associations.set(l,{textures:e}),l}).catch(function(){return null});return this.textureCache[A]=c,c}loadImageSource(e,t){let n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let o=i.images[e],a=self.URL||self.webkitURL,A=o.uri||"",c=!1;if(o.bufferView!==void 0)A=n.getDependency("bufferView",o.bufferView).then(function(u){c=!0;let h=new Blob([u],{type:o.mimeType});return A=a.createObjectURL(h),A});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let l=Promise.resolve(A).then(function(u){return new Promise(function(h,d){let p=h;t.isImageBitmapLoader===!0&&(p=function(g){let m=new It(g);m.needsUpdate=!0,h(m)}),t.load(fi.resolveURL(u,r.path),p,void 0,d)})}).then(function(u){return c===!0&&a.revokeObjectURL(A),Xn(u,o),u.userData.mimeType=o.mimeType||gv(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",A),u});return this.sourceCache[e]=l,l}assignTexture(e,t,n,i){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[He.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[He.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let A=r.associations.get(o);o=r.extensions[He.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,A)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,A=this.cache.get(a);A||(A=new ur,Xt.prototype.copy.call(A,n),A.color.copy(n.color),A.map=n.map,A.sizeAttenuation=!1,this.cache.add(a,A)),n=A}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,A=this.cache.get(a);A||(A=new lr,Xt.prototype.copy.call(A,n),A.color.copy(n.color),A.map=n.map,this.cache.add(a,A)),n=A}if(i||r||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let A=this.cache.get(a);A||(A=n.clone(),r&&(A.vertexColors=!0),o&&(A.flatShading=!0),i&&(A.normalScale&&(A.normalScale.y*=-1),A.clearcoatNormalScale&&(A.clearcoatNormalScale.y*=-1)),this.cache.add(a,A),this.associations.set(A,this.associations.get(n))),n=A}e.material=n}getMaterialType(){return li}loadMaterial(e){let t=this,n=this.json,i=this.extensions,r=n.materials[e],o,a={},A=r.extensions||{},c=[];if(A[He.KHR_MATERIALS_UNLIT]){let u=i[He.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),c.push(u.extendParams(a,r,t))}else{let u=r.pbrMetallicRoughness||{};if(a.color=new Le(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let h=u.baseColorFactor;a.color.setRGB(h[0],h[1],h[2],Dt),a.opacity=h[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",u.baseColorTexture,gt)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Bt);let l=r.alphaMode||jc.OPAQUE;if(l===jc.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,l===jc.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Gt&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new re(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;a.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&o!==Gt&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Gt){let u=r.emissiveFactor;a.emissive=new Le().setRGB(u[0],u[1],u[2],Dt)}return r.emissiveTexture!==void 0&&o!==Gt&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,gt)),Promise.all(c).then(function(){let u=new o(a);return r.name&&(u.name=r.name),Xn(u,r),t.associations.set(u,{materials:e}),r.extensions&&Zi(i,u,r),u})}createUniqueName(e){let t=at.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function r(a){return n[He.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(A){return Nh(A,a,t)})}let o=[];for(let a=0,A=e.length;a<A;a++){let c=e[a],l=mv(c),u=i[l];if(u)o.push(u.promise);else{let h;c.extensions&&c.extensions[He.KHR_DRACO_MESH_COMPRESSION]?h=r(c):h=Nh(new Nt,c,t),i[l]={primitive:c,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,i=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let A=0,c=o.length;A<c;A++){let l=o[A].material===void 0?dv(this.cache):this.getDependency("material",o[A].material);a.push(l)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(A){let c=A.slice(0,A.length-1),l=A[A.length-1],u=[];for(let d=0,p=l.length;d<p;d++){let g=l[d],m=o[d],f,T=c[d];if(m.mode===tn.TRIANGLES||m.mode===tn.TRIANGLE_STRIP||m.mode===tn.TRIANGLE_FAN||m.mode===void 0)f=r.isSkinnedMesh===!0?new Po(g,T):new At(g,T),f.isSkinnedMesh===!0&&f.normalizeSkinWeights(),m.mode===tn.TRIANGLE_STRIP?f.geometry=Vc(f.geometry,qo):m.mode===tn.TRIANGLE_FAN&&(f.geometry=Vc(f.geometry,yr));else if(m.mode===tn.LINES)f=new Lo(g,T);else if(m.mode===tn.LINE_STRIP)f=new ys(g,T);else if(m.mode===tn.LINE_LOOP)f=new Ro(g,T);else if(m.mode===tn.POINTS)f=new zo(g,T);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(f.geometry.morphAttributes).length>0&&pv(f,r),f.name=t.createUniqueName(r.name||"mesh_"+e),Xn(f,r),m.extensions&&Zi(i,f,m),t.assignFinalMaterial(f),u.push(f)}for(let d=0,p=u.length;d<p;d++)t.associations.set(u[d],{meshes:e,primitives:d});if(u.length===1)return r.extensions&&Zi(i,u[0],r),u[0];let h=new zt;r.extensions&&Zi(i,h,r),t.associations.set(h,{meshes:e});for(let d=0,p=u.length;d<p;d++)h.add(u[d]);return h})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Tt(vh.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new ci(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Xn(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let r=i.pop(),o=i,a=[],A=[];for(let c=0,l=o.length;c<l;c++){let u=o[c];if(u){a.push(u);let h=new Re;r!==null&&h.fromArray(r.array,c*16),A.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Eo(a,A)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,o=[],a=[],A=[],c=[],l=[];for(let u=0,h=i.channels.length;u<h;u++){let d=i.channels[u],p=i.samplers[d.sampler],g=d.target,m=g.node,f=i.parameters!==void 0?i.parameters[p.input]:p.input,T=i.parameters!==void 0?i.parameters[p.output]:p.output;g.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",f)),A.push(this.getDependency("accessor",T)),c.push(p),l.push(g))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(A),Promise.all(c),Promise.all(l)]).then(function(u){let h=u[0],d=u[1],p=u[2],g=u[3],m=u[4],f=[];for(let T=0,y=h.length;T<y;T++){let M=h[T],R=d[T],E=p[T],C=g[T],D=m[T];if(M===void 0)continue;M.updateMatrix&&M.updateMatrix();let _=n._createAnimationTracks(M,R,E,C,D);if(_)for(let x=0;x<_.length;x++)f.push(_[x])}return new Is(r,void 0,f)})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let A=0,c=i.weights.length;A<c;A++)a.morphTargetInfluences[A]=i.weights[A]}),o})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=i.children||[];for(let c=0,l=a.length;c<l;c++)o.push(n.getDependency("node",a[c]));let A=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),A]).then(function(c){let l=c[0],u=c[1],h=c[2];h!==null&&l.traverse(function(d){d.isSkinnedMesh&&d.bind(h,Mv)});for(let d=0,p=u.length;d<p;d++)l.add(u[d]);return l})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?i.createUniqueName(r.name):"",a=[],A=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return A&&a.push(A),r.camera!==void 0&&a.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let l;if(r.isBone===!0?l=new cr:c.length>1?l=new zt:c.length===1?l=c[0]:l=new dt,l!==c[0])for(let u=0,h=c.length;u<h;u++)l.add(c[u]);if(r.name&&(l.userData.name=r.name,l.name=o),Xn(l,r),r.extensions&&Zi(n,l,r),r.matrix!==void 0){let u=new Re;u.fromArray(r.matrix),l.applyMatrix4(u)}else r.translation!==void 0&&l.position.fromArray(r.translation),r.rotation!==void 0&&l.quaternion.fromArray(r.rotation),r.scale!==void 0&&l.scale.fromArray(r.scale);return i.associations.has(l)||i.associations.set(l,{}),i.associations.get(l).nodes=e,l}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,r=new zt;n.name&&(r.name=i.createUniqueName(n.name)),Xn(r,n),n.extensions&&Zi(t,r,n);let o=n.nodes||[],a=[];for(let A=0,c=o.length;A<c;A++)a.push(i.getDependency("node",o[A]));return Promise.all(a).then(function(A){for(let l=0,u=A.length;l<u;l++)r.add(A[l]);let c=l=>{let u=new Map;for(let[h,d]of i.associations)(h instanceof Xt||h instanceof It)&&u.set(h,d);return l.traverse(h=>{let d=i.associations.get(h);d!=null&&u.set(h,d)}),u};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){let o=[],a=e.name?e.name:e.uuid,A=[];pi[r.path]===pi.weights?e.traverse(function(h){h.morphTargetInfluences&&A.push(h.name?h.name:h.uuid)}):A.push(a);let c;switch(pi[r.path]){case pi.weights:c=kn;break;case pi.rotation:c=Vn;break;case pi.position:case pi.scale:c=Hn;break;default:switch(n.itemSize){case 1:c=kn;break;case 2:case 3:default:c=Hn;break}break}let l=i.interpolation!==void 0?hv[i.interpolation]:vs,u=this._getArrayFromAccessor(n);for(let h=0,d=A.length;h<d;h++){let p=new c(A[h]+"."+pi[r.path],t.array,u,l);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(p),o.push(p)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=ml(t.constructor),i=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof Vn?fl:na;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function vv(s,e,t){let n=e.attributes,i=new Kt;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],A=a.min,c=a.max;if(A!==void 0&&c!==void 0){if(i.set(new b(A[0],A[1],A[2]),new b(c[0],c[1],c[2])),a.normalized){let l=ml(Es[a.componentType]);i.min.multiplyScalar(l),i.max.multiplyScalar(l)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new b,A=new b;for(let c=0,l=r.length;c<l;c++){let u=r[c];if(u.POSITION!==void 0){let h=t.json.accessors[u.POSITION],d=h.min,p=h.max;if(d!==void 0&&p!==void 0){if(A.setX(Math.max(Math.abs(d[0]),Math.abs(p[0]))),A.setY(Math.max(Math.abs(d[1]),Math.abs(p[1]))),A.setZ(Math.max(Math.abs(d[2]),Math.abs(p[2]))),h.normalized){let g=ml(Es[h.componentType]);A.multiplyScalar(g)}a.max(A)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}s.boundingBox=i;let o=new jt;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function Nh(s,e,t){let n=e.attributes,i=[];function r(o,a){return t.getDependency("accessor",o).then(function(A){s.setAttribute(a,A)})}for(let o in n){let a=pl[o]||o.toLowerCase();a in s.attributes||i.push(r(n[o],a))}if(e.indices!==void 0&&!s.index){let o=t.getDependency("accessor",e.indices).then(function(a){s.setIndex(a)});i.push(o)}return Xe.workingColorSpace!==Dt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Xe.workingColorSpace}" not supported.`),Xn(s,e),vv(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?fv(s,e.targets,t):s})}var Tr=new b;function nn(s,e,t,n,i,r){let o=2*Math.PI*i/4,a=Math.max(r-2*i,0),A=Math.PI/4;Tr.copy(e),Tr[n]=0,Tr.normalize();let c=.5*o/(o+a),l=1-Tr.angleTo(s)/A;return Math.sign(Tr[t])===1?l*c:a/(o+a)+c+c*(1-l)}var ia=class extends zi{constructor(e=1,t=1,n=1,i=2,r=.1){if(i=i*2+1,r=Math.min(e/2,t/2,n/2,r),super(1,1,1,i,i,i),i===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let a=new b,A=new b,c=new b(e,t,n).divideScalar(2).subScalar(r),l=this.attributes.position.array,u=this.attributes.normal.array,h=this.attributes.uv.array,d=l.length/6,p=new b,g=.5/i;for(let m=0,f=0;m<l.length;m+=3,f+=2)switch(a.fromArray(l,m),A.copy(a),A.x-=Math.sign(A.x)*g,A.y-=Math.sign(A.y)*g,A.z-=Math.sign(A.z)*g,A.normalize(),l[m+0]=c.x*Math.sign(a.x)+A.x*r,l[m+1]=c.y*Math.sign(a.y)+A.y*r,l[m+2]=c.z*Math.sign(a.z)+A.z*r,u[m+0]=A.x,u[m+1]=A.y,u[m+2]=A.z,Math.floor(m/d)){case 0:p.set(1,0,0),h[f+0]=nn(p,A,"z","y",r,n),h[f+1]=1-nn(p,A,"y","z",r,t);break;case 1:p.set(-1,0,0),h[f+0]=1-nn(p,A,"z","y",r,n),h[f+1]=1-nn(p,A,"y","z",r,t);break;case 2:p.set(0,1,0),h[f+0]=1-nn(p,A,"x","z",r,e),h[f+1]=nn(p,A,"z","x",r,n);break;case 3:p.set(0,-1,0),h[f+0]=1-nn(p,A,"x","z",r,e),h[f+1]=1-nn(p,A,"z","x",r,n);break;case 4:p.set(0,0,1),h[f+0]=1-nn(p,A,"x","y",r,e),h[f+1]=1-nn(p,A,"y","x",r,t);break;case 5:p.set(0,0,-1),h[f+0]=nn(p,A,"x","y",r,e),h[f+1]=1-nn(p,A,"y","x",r,t);break}}};var Ss=class extends dt{constructor(e=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=e,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new re(.5,.5),this.addEventListener("removed",function(){this.traverse(function(t){t.element instanceof t.element.ownerDocument.defaultView.Element&&t.element.parentNode!==null&&t.element.remove()})})}copy(e,t){return super.copy(e,t),this.element=e.element.cloneNode(!0),this.center=e.center,this}},Cs=new b,Bh=new Re,Uh=new Re,Zh=new b,Fh=new b,sa=class{constructor(e={}){let t=this,n,i,r,o,a={objects:new WeakMap},A=e.element!==void 0?e.element:document.createElement("div");A.style.overflow="hidden",this.domElement=A,this.getSize=function(){return{width:n,height:i}},this.render=function(p,g){p.matrixWorldAutoUpdate===!0&&p.updateMatrixWorld(),g.parent===null&&g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),Bh.copy(g.matrixWorldInverse),Uh.multiplyMatrices(g.projectionMatrix,Bh),l(p,p,g),d(p)},this.setSize=function(p,g){n=p,i=g,r=n/2,o=i/2,A.style.width=p+"px",A.style.height=g+"px"};function c(p){p.isCSS2DObject&&(p.element.style.display="none");for(let g=0,m=p.children.length;g<m;g++)c(p.children[g])}function l(p,g,m){if(p.visible===!1){c(p);return}if(p.isCSS2DObject){Cs.setFromMatrixPosition(p.matrixWorld),Cs.applyMatrix4(Uh);let f=Cs.z>=-1&&Cs.z<=1&&p.layers.test(m.layers)===!0,T=p.element;T.style.display=f===!0?"":"none",f===!0&&(p.onBeforeRender(t,g,m),T.style.transform="translate("+-100*p.center.x+"%,"+-100*p.center.y+"%)translate("+(Cs.x*r+r)+"px,"+(-Cs.y*o+o)+"px)",T.parentNode!==A&&A.appendChild(T),p.onAfterRender(t,g,m));let y={distanceToCameraSquared:u(m,p)};a.objects.set(p,y)}for(let f=0,T=p.children.length;f<T;f++)l(p.children[f],g,m)}function u(p,g){return Zh.setFromMatrixPosition(p.matrixWorld),Fh.setFromMatrixPosition(g.matrixWorld),Zh.distanceToSquared(Fh)}function h(p){let g=[];return p.traverseVisible(function(m){m.isCSS2DObject&&g.push(m)}),g}function d(p){let g=h(p).sort(function(f,T){if(f.renderOrder!==T.renderOrder)return T.renderOrder-f.renderOrder;let y=a.objects.get(f).distanceToCameraSquared,M=a.objects.get(T).distanceToCameraSquared;return y-M}),m=g.length;for(let f=0,T=g.length;f<T;f++)g[f].element.style.zIndex=m-f}}};var kh="Z2xURgIAAABIVgEAWHAAAEpTT057ImFzc2V0Ijp7ImdlbmVyYXRvciI6IlVuaXR5R0xURiIsInZlcnNpb24iOiIyLjAifSwiZXh0ZW5zaW9uc1VzZWQiOlsiS0hSX3RleHR1cmVfdHJhbnNmb3JtIl0sInNjZW5lIjowLCJzY2VuZXMiOlt7Im5vZGVzIjpbMF0sIm5hbWUiOiJjaGFyYWN0ZXIifV0sImFjY2Vzc29ycyI6W3siYnVmZmVyVmlldyI6MCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjc2LCJ0eXBlIjoiVkVDMyIsIm1heCI6WzAuMDc1MDAwMDAyOTgwMjMyMjM5LDAuMTAwMDAwMDAxNDkwMTE2MTIsMC4xNTAwMDAwMDU5NjA0NjQ0OF0sIm1pbiI6Wy0wLjA3NTAwMDAwMjk4MDIzMjIzOSwtMC4yMDAwMDAwMDI5ODAyMzIyNCwtMC4wNzUwMDAwMDI5ODAyMzIyMzldfSx7ImJ1ZmZlclZpZXciOjEsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50Ijo3NiwidHlwZSI6IlZFQzMiLCJtYXgiOlswLjk2ODIwMTA0MTIyMTYxODY1LDEuMCwwLjkyMzg3OTUwNDIwMzc5NjM5XSwibWluIjpbLTAuOTY4MjAxMDQxMjIxNjE4NjUsLTEuMCwtMC45MjM4Nzk1MDQyMDM3OTYzOV19LHsiYnVmZmVyVmlldyI6MiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjc2LCJ0eXBlIjoiVkVDNCIsIm1heCI6WzEuMCwwLjI3ODA5MjQ3Mzc0NTM0NjA3LDAuOTc1MzcwNzY0NzMyMzYwODQsMS4wXSwibWluIjpbLTEuMCwtMC4yNzgwOTI0NzM3NDUzNDYwNywtMC45NzUzNzA3NjQ3MzIzNjA4NCwxLjBdfSx7ImJ1ZmZlclZpZXciOjMsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50Ijo3NiwidHlwZSI6IlZFQzIiLCJtYXgiOlswLjk2ODc1LDAuNzI1MDAwMDIzODQxODU3OTFdLCJtaW4iOlswLjk2ODc1LDAuNTI0OTk5OTc2MTU4MTQyMDldfSx7ImJ1ZmZlclZpZXciOjQsImNvbXBvbmVudFR5cGUiOjUxMjEsImNvdW50IjoxMzIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOls3NS4wXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo1LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6NzYsInR5cGUiOiJWRUMzIiwibWF4IjpbMC4wNzUwMDAwMDI5ODAyMzIyMzksMC4xMDAwMDAwMDE0OTAxMTYxMiwwLjE1MDAwMDAwNTk2MDQ2NDQ4XSwibWluIjpbLTAuMDc1MDAwMDAyOTgwMjMyMjM5LC0wLjIwMDAwMDAwMjk4MDIzMjI0LC0wLjA3NTAwMDAwMjk4MDIzMjIzOV19LHsiYnVmZmVyVmlldyI6NiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjc2LCJ0eXBlIjoiVkVDMyIsIm1heCI6WzAuOTY4MjAxMDQxMjIxNjE4NjUsMS4wLDAuOTIzODc5NTA0MjAzNzk2MzldLCJtaW4iOlstMC45NjgyMDEwNDEyMjE2MTg2NSwtMS4wLC0wLjkyMzg3OTUwNDIwMzc5NjM5XX0seyJidWZmZXJWaWV3Ijo3LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6NzYsInR5cGUiOiJWRUM0IiwibWF4IjpbMS4wLDAuMjc4MDkyNDczNzQ1MzQ2MDcsMC45NzUzNzA3NjQ3MzIzNjA4NCwxLjBdLCJtaW4iOlstMS4wLC0wLjI3ODA5MjQ3Mzc0NTM0NjA3LC0wLjk3NTM3MDc2NDczMjM2MDg0LDEuMF19LHsiYnVmZmVyVmlldyI6OCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjc2LCJ0eXBlIjoiVkVDMiIsIm1heCI6WzAuOTY4NzUsMC43MjUwMDAwMjM4NDE4NTc5MV0sIm1pbiI6WzAuOTY4NzUsMC41MjQ5OTk5NzYxNTgxNDIwOV19LHsiYnVmZmVyVmlldyI6OSwiY29tcG9uZW50VHlwZSI6NTEyMSwiY291bnQiOjEzMiwidHlwZSI6IlNDQUxBUiIsIm1heCI6Wzc1LjBdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjEwLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MzYyLCJ0eXBlIjoiVkVDMyIsIm1heCI6WzAuMzAwMDAwMDExOTIwOTI4OTYsMC42MDAwMDAwMjM4NDE4NTc5MSwwLjMzNTAwMDAwODM0NDY1MDI3XSwibWluIjpbLTAuMzAwMDAwMDExOTIwOTI4OTYsMC4wLC0wLjMwMDAwMDAxMTkyMDkyODk2XX0seyJidWZmZXJWaWV3IjoxMSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjM2MiwidHlwZSI6IlZFQzMiLCJtYXgiOlswLjk4MDc4NTI1MDY2Mzc1NzMyLDEuMCwxLjAwMDAwMDExOTIwOTI4OTZdLCJtaW4iOlstMC45ODA3ODUyNTA2NjM3NTczMiwtMS4wLC0wLjk4MDc4NTI1MDY2Mzc1NzMyXX0seyJidWZmZXJWaWV3IjoxMiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjM2MiwidHlwZSI6IlZFQzQiLCJtYXgiOlsxLjAwMDAwMDExOTIwOTI4OTYsMC4yMTYyMzgzNzk0Nzg0NTQ1OSwwLjk4OTQ2NjAxMTUyNDIwMDQ0LDEuMF0sIm1pbiI6Wy0xLjAsLTAuMjE2MjM4MzY0NTc3MjkzNCwtMC45ODk0NjYwMTE1MjQyMDA0NCwxLjBdfSx7ImJ1ZmZlclZpZXciOjEzLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MzYyLCJ0eXBlIjoiVkVDMiIsIm1heCI6WzAuOTY4NzUsMC45NzUwMDAwMjM4NDE4NTc5MV0sIm1pbiI6WzAuMDkzNzUsMC41MjQ5OTk5NzYxNTgxNDIwOV19LHsiYnVmZmVyVmlldyI6MTQsImNvbXBvbmVudFR5cGUiOjUxMjMsImNvdW50Ijo1NDYsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlszNjEuMF0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6MTUsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxMzQsInR5cGUiOiJWRUMzIiwibWF4IjpbMC4zMDAwMDAwMTE5MjA5Mjg5NiwwLjEyNSwwLjEyNV0sIm1pbiI6Wy0wLjE1MDAwMDAwNTk2MDQ2NDQ4LC0wLjEyNSwtMC4xMjVdfSx7ImJ1ZmZlclZpZXciOjE2LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTM0LCJ0eXBlIjoiVkVDMyIsIm1heCI6WzEuMCwxLjAsMS4wXSwibWluIjpbLTEuMCwtMS4wLC0xLjBdfSx7ImJ1ZmZlclZpZXciOjE3LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTM0LCJ0eXBlIjoiVkVDNCIsIm1heCI6WzEuMCwwLjcwNzEwNjg4ODI5NDIyLDEuMCwxLjBdLCJtaW4iOlstMS4wLC0wLjM0Mzg5MzgyNjAwNzg0MywtMS4wLDEuMF19LHsiYnVmZmVyVmlldyI6MTgsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxMzQsInR5cGUiOiJWRUMyIiwibWF4IjpbMC45Njg3NSwwLjk3NTAwMDAyMzg0MTg1NzkxXSwibWluIjpbMC41OTM3NSwwLjYyNV19LHsiYnVmZmVyVmlldyI6MTksImNvbXBvbmVudFR5cGUiOjUxMjEsImNvdW50IjoyNDAsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlsxMzMuMF0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6MjAsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxMzQsInR5cGUiOiJWRUMzIiwibWF4IjpbMC4xNTAwMDAwMDU5NjA0NjQ0OCwwLjE4MDUwMDAwMDcxNTI1NTc0LDAuMTI1XSwibWluIjpbLTAuMzAwMDAwMDExOTIwOTI4OTYsLTAuMDY5NDk5OTk5Mjg0NzQ0MjYzLC0wLjEyNV19LHsiYnVmZmVyVmlldyI6MjEsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxMzQsInR5cGUiOiJWRUMzIiwibWF4IjpbMS4wLDEuMCwxLjBdLCJtaW4iOlstMS4wLC0xLjAsLTEuMF19LHsiYnVmZmVyVmlldyI6MjIsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxMzQsInR5cGUiOiJWRUM0IiwibWF4IjpbMS4wLDAuMzQzODkzODI2MDA3ODQzLDEuMCwxLjBdLCJtaW4iOlstMS4wLC0wLjcwNzEwNjg4ODI5NDIyLC0xLjAsMS4wXX0seyJidWZmZXJWaWV3IjoyMywiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjEzNCwidHlwZSI6IlZFQzIiLCJtYXgiOlswLjk2ODc1LDAuOTc1MDAwMDIzODQxODU3OTFdLCJtaW4iOlswLjU5Mzc1LDAuNTk0MjUyMTA5NTI3NTg3ODldfSx7ImJ1ZmZlclZpZXciOjI0LCJjb21wb25lbnRUeXBlIjo1MTIxLCJjb3VudCI6MjQwLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMTMzLjBdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjI1LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MjU2LCJ0eXBlIjoiVkVDMyIsIm1heCI6WzAuMTAwMDAwMDIzODQxODU3OTEsMC4zMDAwMDAwMTE5MjA5Mjg5NiwwLjA5OTk5OTk3OTEzODM3NDMyOV0sIm1pbiI6Wy0wLjA5OTk5OTk3OTEzODM3NDMyOSwtMC4wNDk5OTk5ODk1NjkxODcxNjQsLTAuMTAwMDAwMDIzODQxODU3OTFdfSx7ImJ1ZmZlclZpZXciOjI2LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MjU2LCJ0eXBlIjoiVkVDMyIsIm1heCI6WzAuOTY0MTI4MjU1ODQ0MTE2MjEsMS4wLDAuOTY0MTI4MjU1ODQ0MTE2MjFdLCJtaW4iOlstMC45NjQxMjgyNTU4NDQxMTYyMSwtMS4wLC0wLjk2NDEyODI1NTg0NDExNjIxXX0seyJidWZmZXJWaWV3IjoyNywiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjI1NiwidHlwZSI6IlZFQzQiLCJtYXgiOlsxLjAsMC4xOTgyNDg4NDgzMTkwNTM2NSwwLjk4OTQ2NjAxMTUyNDIwMDQ0LDEuMF0sIm1pbiI6Wy0xLjAsLTAuMTk4MjQ4ODQ4MzE5MDUzNjUsLTAuOTg5NDY2MDExNTI0MjAwNDQsMS4wXX0seyJidWZmZXJWaWV3IjoyOCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjI1NiwidHlwZSI6IlZFQzIiLCJtYXgiOlswLjk2ODc1LDAuOTc1MDAwMDIzODQxODU3OTFdLCJtaW4iOlswLjA5Mzc1LDAuNTI0OTk5OTc2MTU4MTQyMDldfSx7ImJ1ZmZlclZpZXciOjI5LCJjb21wb25lbnRUeXBlIjo1MTIzLCJjb3VudCI6MzYwLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMjU1LjBdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjMwLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlNDQUxBUiIsIm1heCI6WzAuMTAwMDAwMDAxNDkwMTE2MTJdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjMxLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlZFQzMiLCJtYXgiOlswLjAsMC4wMjM3NDk5OTk3MDE5NzY3NzYsOS4wMjM4OTI2MzUwOTc3OEUtMTddLCJtaW4iOlswLjAsMC4wMjM3NDk5OTk3MDE5NzY3NzYsOS4wMjM4OTI2MzUwOTc3OEUtMTddfSx7ImJ1ZmZlclZpZXciOjMyLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlNDQUxBUiIsIm1heCI6WzAuMTAwMDAwMDAxNDkwMTE2MTJdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjMzLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlZFQzQiLCJtYXgiOlswLjAsMC4wLDAuMCwtMS4wXSwibWluIjpbMC4wLDAuMCwwLjAsLTEuMF19LHsiYnVmZmVyVmlldyI6MzQsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC4xMDAwMDAwMDE0OTAxMTYxMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6MzUsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiVkVDMyIsIm1heCI6WzEuMCwxLjAsMS4wXSwibWluIjpbMS4wLDEuMCwxLjBdfSx7ImJ1ZmZlclZpZXciOjM2LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlNDQUxBUiIsIm1heCI6WzAuMTAwMDAwMDAxNDkwMTE2MTJdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjM3LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlZFQzMiLCJtYXgiOlswLjEyNSwwLjE3NjI0OTk5NTgyNzY3NDg3LC0wLjAyMzc0OTk5OTcwMTk3Njc3Nl0sIm1pbiI6WzAuMTI1LDAuMTc2MjQ5OTk1ODI3Njc0ODcsLTAuMDIzNzQ5OTk5NzAxOTc2Nzc2XX0seyJidWZmZXJWaWV3IjozOCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjEwMDAwMDAwMTQ5MDExNjEyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3IjozOSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUM0IiwibWF4IjpbMC4wLDAuMCwwLjAsLTEuMF0sIm1pbiI6WzAuMCwwLjAsMC4wLC0xLjBdfSx7ImJ1ZmZlclZpZXciOjQwLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlNDQUxBUiIsIm1heCI6WzAuMTAwMDAwMDAxNDkwMTE2MTJdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjQxLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlZFQzMiLCJtYXgiOlsxLjAsMS4wLDEuMF0sIm1pbiI6WzEuMCwxLjAsMS4wXX0seyJidWZmZXJWaWV3Ijo0MiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjEwMDAwMDAwMTQ5MDExNjEyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo0MywiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUMzIiwibWF4IjpbLTAuMTI1LDAuMTc2MjQ5OTk1ODI3Njc0ODcsLTAuMDIzNzUwMDAxNTY0NjIxOTI1XSwibWluIjpbLTAuMTI1LDAuMTc2MjQ5OTk1ODI3Njc0ODcsLTAuMDIzNzUwMDAxNTY0NjIxOTI1XX0seyJidWZmZXJWaWV3Ijo0NCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjEwMDAwMDAwMTQ5MDExNjEyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo0NSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUM0IiwibWF4IjpbMC4wLDAuMCwwLjAsLTEuMF0sIm1pbiI6WzAuMCwwLjAsMC4wLC0xLjBdfSx7ImJ1ZmZlclZpZXciOjQ2LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlNDQUxBUiIsIm1heCI6WzAuMTAwMDAwMDAxNDkwMTE2MTJdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjQ3LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlZFQzMiLCJtYXgiOlsxLjAsMS4wLDEuMF0sIm1pbiI6WzEuMCwxLjAsMS4wXX0seyJidWZmZXJWaWV3Ijo0OCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjEwMDAwMDAwMTQ5MDExNjEyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo0OSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUMzIiwibWF4IjpbLTEuODA0Nzc4NjA2NDI4ODk0OUUtMTUsMC4xNzYyNDk5OTU4Mjc2NzQ4NywtMC4wMjM3NDk5OTk3MDE5NzY3NzZdLCJtaW4iOlstMS44MDQ3Nzg2MDY0Mjg4OTQ5RS0xNSwwLjE3NjI0OTk5NTgyNzY3NDg3LC0wLjAyMzc0OTk5OTcwMTk3Njc3Nl19LHsiYnVmZmVyVmlldyI6NTAsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC4xMDAwMDAwMDE0OTAxMTYxMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6NTEsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiVkVDNCIsIm1heCI6WzAuMCwwLjAsMC4wLC0xLjBdLCJtaW4iOlswLjAsMC4wLDAuMCwtMS4wXX0seyJidWZmZXJWaWV3Ijo1MiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjEwMDAwMDAwMTQ5MDExNjEyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo1MywiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUMzIiwibWF4IjpbMS4wLDEuMCwxLjBdLCJtaW4iOlsxLjAsMS4wLDEuMF19LHsiYnVmZmVyVmlldyI6NTQsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC4xMDAwMDAwMDE0OTAxMTYxMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6NTUsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiVkVDMyIsIm1heCI6WzAuMzAwMDAwMDExOTIwOTI4OTYsMC4xNzUwMDAwMTE5MjA5Mjg5NiwwLjBdLCJtaW4iOlswLjMwMDAwMDAxMTkyMDkyODk2LDAuMTc1MDAwMDExOTIwOTI4OTYsMC4wXX0seyJidWZmZXJWaWV3Ijo1NiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjEwMDAwMDAwMTQ5MDExNjEyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo1NywiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUM0IiwibWF4IjpbMC4wLDAuMCwwLjAsLTEuMF0sIm1pbiI6WzAuMCwwLjAsMC4wLC0xLjBdfSx7ImJ1ZmZlclZpZXciOjU4LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlNDQUxBUiIsIm1heCI6WzAuMTAwMDAwMDAxNDkwMTE2MTJdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjU5LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MiwidHlwZSI6IlZFQzMiLCJtYXgiOlsxLjAsMS4wLDEuMF0sIm1pbiI6WzEuMCwxLjAsMS4wXX0seyJidWZmZXJWaWV3Ijo2MCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjEwMDAwMDAwMTQ5MDExNjEyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo2MSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUMzIiwibWF4IjpbLTAuMzAwMDAwMDExOTIwOTI4OTYsMC4xMTk0OTk5OTYzMDQ1MTIwMiwwLjBdLCJtaW4iOlstMC4zMDAwMDAwMTE5MjA5Mjg5NiwwLjExOTQ5OTk5NjMwNDUxMjAyLDAuMF19LHsiYnVmZmVyVmlldyI6NjIsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC4xMDAwMDAwMDE0OTAxMTYxMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6NjMsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiVkVDNCIsIm1heCI6WzAuMCwwLjAsMC4wLC0xLjBdLCJtaW4iOlswLjAsMC4wLDAuMCwtMS4wXX0seyJidWZmZXJWaWV3Ijo2NCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjEwMDAwMDAwMTQ5MDExNjEyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo2NSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUMzIiwibWF4IjpbMS4wLDEuMCwxLjBdLCJtaW4iOlsxLjAsMS4wLDEuMF19LHsiYnVmZmVyVmlldyI6NjYsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC4xMDAwMDAwMDE0OTAxMTYxMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6NjcsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiVkVDMyIsIm1heCI6WzAuMCwwLjYwMDAwMDAyMzg0MTg1NzkxLDAuMF0sIm1pbiI6WzAuMCwwLjYwMDAwMDAyMzg0MTg1NzkxLDAuMF19LHsiYnVmZmVyVmlldyI6NjgsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC4xMDAwMDAwMDE0OTAxMTYxMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6NjksImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiVkVDNCIsIm1heCI6WzAuMCwwLjAsMC4wLC0xLjBdLCJtaW4iOlswLjAsMC4wLDAuMCwtMS4wXX0seyJidWZmZXJWaWV3Ijo3MCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjEwMDAwMDAwMTQ5MDExNjEyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo3MSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUMzIiwibWF4IjpbMS4wLDEuMCwxLjBdLCJtaW4iOlsxLjAsMS4wLDEuMF19LHsiYnVmZmVyVmlldyI6NzIsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC42NjY2NjY2ODY1MzQ4ODE1OV0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6NzMsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiVkVDNCIsIm1heCI6WzAuMCwtMC4xMzA1MjYxOTk5MzY4NjY3NiwwLjAsLTAuOTkxNDQ0ODg1NzMwNzQzNDFdLCJtaW4iOlswLjAsLTAuMTMwNTI2MTk5OTM2ODY2NzYsMC4wLC0wLjk5MTQ0NDg4NTczMDc0MzQxXX0seyJidWZmZXJWaWV3Ijo3NCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjY2NjY2NjY4NjUzNDg4MTU5XSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo3NSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUM0IiwibWF4IjpbMC4wLDAuMTMwNTI2MTk5OTM2ODY2NzYsMC4wLC0wLjk5MTQ0NDg4NTczMDc0MzQxXSwibWluIjpbMC4wLDAuMTMwNTI2MTk5OTM2ODY2NzYsMC4wLC0wLjk5MTQ0NDg4NTczMDc0MzQxXX0seyJidWZmZXJWaWV3Ijo3NiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIwLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC42NjY2NjY2ODY1MzQ4ODE1OV0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6NzcsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyMCwidHlwZSI6IlZFQzQiLCJtYXgiOlswLjA0MzYxOTM4Njg1MTc4NzU2NywwLjAsMC4wLC0wLjk5OTA0ODIzMzAzMjIyNjU2XSwibWluIjpbMi45MTAzODMwNDU2NzMzNzA0RS0xMSwwLjAsMC4wLC0xLjBdfSx7ImJ1ZmZlclZpZXciOjc4LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MjAsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjY2NjY2NjY4NjUzNDg4MTU5XSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo3OSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIwLCJ0eXBlIjoiVkVDNCIsIm1heCI6WzAuMDg3MTU1NzM2OTgyODIyNDE4LDAuMCwwLjAsLTAuOTk2MTk0NzIwMjY4MjQ5NTFdLCJtaW4iOlswLjAsMC4wLDAuMCwtMS4wXX0seyJidWZmZXJWaWV3Ijo4MCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIwLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC42NjY2NjY2ODY1MzQ4ODE1OV0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6ODEsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyMCwidHlwZSI6IlZFQzQiLCJtYXgiOlswLjAsMC4wLDAuMzgyNjgzNDg1NzQ2MzgzNjcsLTAuOTIzODc5NTYzODA4NDQxMTZdLCJtaW4iOlswLjAsMC4wLDAuMjU4ODE5MDQzNjM2MzIyLC0wLjk2NTkyNTgxMjcyMTI1MjQ0XX0seyJidWZmZXJWaWV3Ijo4MiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIwLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC42NjY2NjY2ODY1MzQ4ODE1OV0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6ODMsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyMCwidHlwZSI6IlZFQzQiLCJtYXgiOlswLjAsMC4wLC0wLjI1ODgxOTA0MzYzNjMyMiwtMC45MjM4Nzk1NjM4MDg0NDExNl0sIm1pbiI6WzAuMCwwLjAsLTAuMzgyNjgzNDg1NzQ2MzgzNjcsLTAuOTY1OTI1ODEyNzIxMjUyNDRdfSx7ImJ1ZmZlclZpZXciOjg0LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTMsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjQzMzMzMzMzNzMwNjk3NjMyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo4NSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjEzLCJ0eXBlIjoiVkVDMyIsIm1heCI6WzAuMCwwLjE2OTQ1NTU1ODA2MTU5OTczLDkuMDIzODkyNjM1MDk3NzhFLTE3XSwibWluIjpbMC4wLDAuMDIzNzQ5OTk5NzAxOTc2Nzc2LDkuMDIzODkyNjM1MDk3NzhFLTE3XX0seyJidWZmZXJWaWV3Ijo4NiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjEzLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC40MzMzMzMzMzczMDY5NzYzMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6ODcsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxMywidHlwZSI6IlZFQzMiLCJtYXgiOlswLjEyNSwwLjI0NDk3MDEyNzk0MDE3NzkyLDAuMTUxMjkwODE5MDQ4ODgxNTNdLCJtaW4iOlswLjEyNSwwLjE3NjI0OTk5NTgyNzY3NDg3LC0wLjIxODE1NTI2NDg1NDQzMTE1XX0seyJidWZmZXJWaWV3Ijo4OCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjEzLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC40MzMzMzMzMzczMDY5NzYzMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6ODksImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxMywidHlwZSI6IlZFQzQiLCJtYXgiOlswLjM2ODg5MDg1MTczNjA2ODczLDAuMCwwLjAsLTAuOTI5NDcyNzQ0NDY0ODc0MjddLCJtaW4iOlstMC4zNjg4OTA5MTEzNDA3MTM1LDAuMCwwLjAsLTEuMF19LHsiYnVmZmVyVmlldyI6OTAsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxMywidHlwZSI6IlNDQUxBUiIsIm1heCI6WzAuNDMzMzMzMzM3MzA2OTc2MzJdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjkxLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTMsInR5cGUiOiJWRUMzIiwibWF4IjpbLTAuMTI1LDAuMjAyNDYyODIyMTk4ODY3OCwwLjE0ODI5MDgxMjk2OTIwNzc2XSwibWluIjpbLTAuMTI1LDAuMTc2MjQ5OTk1ODI3Njc0ODcsLTAuMjAyODc1MzQ1OTQ1MzU4MjhdfSx7ImJ1ZmZlclZpZXciOjkyLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTMsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjQzMzMzMzMzNzMwNjk3NjMyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo5MywiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjEzLCJ0eXBlIjoiVkVDNCIsIm1heCI6WzAuMzY4ODkwOTExMzQwNzEzNSwwLjAsMC4wLC0wLjkyOTQ3Mjc0NDQ2NDg3NDI3XSwibWluIjpbLTAuMzY4ODkwODUxNzM2MDY4NzMsMC4wLDAuMCwtMS4wXX0seyJidWZmZXJWaWV3Ijo5NCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjEzLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC40MzMzMzMzMzczMDY5NzYzMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6OTUsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxMywidHlwZSI6IlZFQzQiLCJtYXgiOlswLjAwMjUxNDk1Njk4NDY2ODk3LDAuMDIxNTU3MjMyMzY1MDEyMTY5LDAuMzgyNjgzNDg1NzQ2MzgzNjcsLTAuOTIzODc5NTYzODA4NDQxMTZdLCJtaW4iOlstMC4wMDI1MTQ5NTUzNTQ4NTQ0NjQ1LC0wLjAyMTU1NzIzNDIyNzY1NzMxOCwwLjE0Mzk1NzY4OTQwNDQ4NzYxLC0wLjk4OTM1NDQzMTYyOTE4MDkxXX0seyJidWZmZXJWaWV3Ijo5NiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjEzLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC40MzMzMzMzMzczMDY5NzYzMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6OTcsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxMywidHlwZSI6IlZFQzQiLCJtYXgiOlswLjAwMjUxNDk1Njk4NDY2ODk3LDAuMDIxNTU3MjM0MjI3NjU3MzE4LC0wLjE0Mzk1NzY4OTQwNDQ4NzYxLC0wLjkyMzg3OTU2MzgwODQ0MTE2XSwibWluIjpbLTAuMDAyNTE0OTU1MzU0ODU0NDY0NSwtMC4wMjE1NTcyMzIzNjUwMTIxNjksLTAuMzgyNjgzNDg1NzQ2MzgzNjcsLTAuOTg5MzU0NDMxNjI5MTgwOTFdfSx7ImJ1ZmZlclZpZXciOjk4LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTMsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjQzMzMzMzMzNzMwNjk3NjMyXSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3Ijo5OSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjEzLCJ0eXBlIjoiVkVDNCIsIm1heCI6WzAuMDQxOTMzODEyMjAxMDIzMSwwLjAzOTgyNTM3NjEyMzE4OTkyNiwwLjAwMjk5Nzc2ODU3NzE4ODI1MzQsLTAuOTk2NTY2NzcyNDYwOTM3NV0sIm1pbiI6Wy0wLjA0MTg1OTk2NTc3MTQzNjY5MSwtMC4wNzEzNjgzNDQxMjgxMzE4NjYsMC4wLC0xLjBdfSx7ImJ1ZmZlclZpZXciOjEwMCwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjEzLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC40MzMzMzMzMzczMDY5NzYzMl0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6MTAxLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTMsInR5cGUiOiJWRUM0IiwibWF4IjpbMC4xMjYwNzQzMTQxMTc0MzE2NCwwLjAsMC4wLC0wLjk5MjAyMDg0NTQxMzIwOF0sIm1pbiI6WzAuMCwwLjAsMC4wLC0xLjBdfSx7ImJ1ZmZlclZpZXciOjEwMiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjVdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjEwMywiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjIsInR5cGUiOiJWRUMzIiwibWF4IjpbLTAuMTI1LDAuMjI5MDAwMDAyMTQ1NzY3MjEsLTAuMTkzMDAwMDAzNjk1NDg3OThdLCJtaW4iOlstMC4xMjUsMC4yMjkwMDAwMDIxNDU3NjcyMSwtMC4xOTMwMDAwMDM2OTU0ODc5OF19LHsiYnVmZmVyVmlldyI6MTA0LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTUsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjVdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjEwNSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjE1LCJ0eXBlIjoiVkVDNCIsIm1heCI6Wy0wLjI4NDk3NzQzNjA2NTY3MzgzLDAuMCwwLjAsLTAuODc5MTY5ODgxMzQzODQxNTVdLCJtaW4iOlstMC40NzY1MDg1NTc3OTY0NzgyNywwLjAsMC4wLC0wLjk1ODUzNDI0MDcyMjY1NjI1XX0seyJidWZmZXJWaWV3IjoxMDYsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC41XSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3IjoxMDcsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoyLCJ0eXBlIjoiVkVDMyIsIm1heCI6WzAuMTI1LDAuMjM4OTk5OTkyNjA5MDI0MDUsMC4wNzY5OTk5OTk1ODI3Njc0ODddLCJtaW4iOlswLjEyNSwwLjIzODk5OTk5MjYwOTAyNDA1LDAuMDc2OTk5OTk5NTgyNzY3NDg3XX0seyJidWZmZXJWaWV3IjoxMDgsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxNSwidHlwZSI6IlNDQUxBUiIsIm1heCI6WzAuNV0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6MTA5LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTUsInR5cGUiOiJWRUM0IiwibWF4IjpbMC4yNTIwNjA5MjAwMDAwNzYyOSwwLjAsMC4wLC0wLjk2NzcxMTM4OTA2NDc4ODgyXSwibWluIjpbMC4xMjI0OTYyOTk0NDU2MjkxMiwwLjAsMC4wLC0wLjk5MjQ2OTAxMjczNzI3NDE3XX0seyJidWZmZXJWaWV3IjoxMTAsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxNSwidHlwZSI6IlNDQUxBUiIsIm1heCI6WzAuNV0sIm1pbiI6WzAuMF19LHsiYnVmZmVyVmlldyI6MTExLCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTUsInR5cGUiOiJWRUM0IiwibWF4IjpbMC4wLDAuMCwtMC4wMDE3OTg3NjcwMTQ0MDY2MjE1LC0wLjk5MTQ0NDg4NTczMDc0MzQxXSwibWluIjpbLTAuMDAxNDg4OTAxNzkxMTYyNzg4OSwtMC4wMTExNTk0NDk4MTU3NTAxMjIsLTAuMTMwNTI2MTk5OTM2ODY2NzYsLTAuOTk5OTM1MDMwOTM3MTk0ODJdfSx7ImJ1ZmZlclZpZXciOjExMiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjE1LCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC41XSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3IjoxMTMsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxNSwidHlwZSI6IlZFQzQiLCJtYXgiOlswLjAsMC4wMTExNTk0NDk4MTU3NTAxMjIsMC4xMzA1MjYxOTk5MzY4NjY3NiwtMC45OTE0NDQ4ODU3MzA3NDM0MV0sIm1pbiI6Wy0wLjAwMTQ4ODkwMTc5MTE2Mjc4ODksMC4wLDAuMDAxNzk4NzY3MDE0NDA2NjIxNSwtMC45OTk5MzUwMzA5MzcxOTQ4Ml19LHsiYnVmZmVyVmlldyI6MTE0LCJjb21wb25lbnRUeXBlIjo1MTI2LCJjb3VudCI6MTUsInR5cGUiOiJTQ0FMQVIiLCJtYXgiOlswLjVdLCJtaW4iOlswLjBdfSx7ImJ1ZmZlclZpZXciOjExNSwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjE1LCJ0eXBlIjoiVkVDNCIsIm1heCI6WzAuMDQzNjE5Mzg2ODUxNzg3NTY3LDAuMCwwLjAsLTAuOTk5MDQ4MjMzMDMyMjI2NTZdLCJtaW4iOlswLjAwMDU1NTkxMzE5Njg3NjY0NTA5LDAuMCwwLjAsLTAuOTk5OTk5ODgwNzkwNzEwNDVdfSx7ImJ1ZmZlclZpZXciOjExNiwiY29tcG9uZW50VHlwZSI6NTEyNiwiY291bnQiOjE1LCJ0eXBlIjoiU0NBTEFSIiwibWF4IjpbMC41XSwibWluIjpbMC4wXX0seyJidWZmZXJWaWV3IjoxMTcsImNvbXBvbmVudFR5cGUiOjUxMjYsImNvdW50IjoxNSwidHlwZSI6IlZFQzQiLCJtYXgiOlswLjEzMDUyNjE5OTkzNjg2Njc2LDAuMCwwLjAsLTAuOTkxNDQ0ODg1NzMwNzQzNDFdLCJtaW4iOlswLjAsMC4wLDAuMCwtMS4wXX1dLCJhbmltYXRpb25zIjpbeyJjaGFubmVscyI6W3sic2FtcGxlciI6MCwidGFyZ2V0Ijp7Im5vZGUiOjEsInBhdGgiOiJ0cmFuc2xhdGlvbiJ9fSx7InNhbXBsZXIiOjEsInRhcmdldCI6eyJub2RlIjoxLCJwYXRoIjoicm90YXRpb24ifX0seyJzYW1wbGVyIjoyLCJ0YXJnZXQiOnsibm9kZSI6MSwicGF0aCI6InNjYWxlIn19LHsic2FtcGxlciI6MywidGFyZ2V0Ijp7Im5vZGUiOjIsInBhdGgiOiJ0cmFuc2xhdGlvbiJ9fSx7InNhbXBsZXIiOjQsInRhcmdldCI6eyJub2RlIjoyLCJwYXRoIjoicm90YXRpb24ifX0seyJzYW1wbGVyIjo1LCJ0YXJnZXQiOnsibm9kZSI6MiwicGF0aCI6InNjYWxlIn19LHsic2FtcGxlciI6NiwidGFyZ2V0Ijp7Im5vZGUiOjMsInBhdGgiOiJ0cmFuc2xhdGlvbiJ9fSx7InNhbXBsZXIiOjcsInRhcmdldCI6eyJub2RlIjozLCJwYXRoIjoicm90YXRpb24ifX0seyJzYW1wbGVyIjo4LCJ0YXJnZXQiOnsibm9kZSI6MywicGF0aCI6InNjYWxlIn19LHsic2FtcGxlciI6OSwidGFyZ2V0Ijp7Im5vZGUiOjQsInBhdGgiOiJ0cmFuc2xhdGlvbiJ9fSx7InNhbXBsZXIiOjEwLCJ0YXJnZXQiOnsibm9kZSI6NCwicGF0aCI6InJvdGF0aW9uIn19LHsic2FtcGxlciI6MTEsInRhcmdldCI6eyJub2RlIjo0LCJwYXRoIjoic2NhbGUifX0seyJzYW1wbGVyIjoxMiwidGFyZ2V0Ijp7Im5vZGUiOjUsInBhdGgiOiJ0cmFuc2xhdGlvbiJ9fSx7InNhbXBsZXIiOjEzLCJ0YXJnZXQiOnsibm9kZSI6NSwicGF0aCI6InJvdGF0aW9uIn19LHsic2FtcGxlciI6MTQsInRhcmdldCI6eyJub2RlIjo1LCJwYXRoIjoic2NhbGUifX0seyJzYW1wbGVyIjoxNSwidGFyZ2V0Ijp7Im5vZGUiOjYsInBhdGgiOiJ0cmFuc2xhdGlvbiJ9fSx7InNhbXBsZXIiOjE2LCJ0YXJnZXQiOnsibm9kZSI6NiwicGF0aCI6InJvdGF0aW9uIn19LHsic2FtcGxlciI6MTcsInRhcmdldCI6eyJub2RlIjo2LCJwYXRoIjoic2NhbGUifX0seyJzYW1wbGVyIjoxOCwidGFyZ2V0Ijp7Im5vZGUiOjcsInBhdGgiOiJ0cmFuc2xhdGlvbiJ9fSx7InNhbXBsZXIiOjE5LCJ0YXJnZXQiOnsibm9kZSI6NywicGF0aCI6InJvdGF0aW9uIn19LHsic2FtcGxlciI6MjAsInRhcmdldCI6eyJub2RlIjo3LCJwYXRoIjoic2NhbGUifX1dLCJzYW1wbGVycyI6W3siaW5wdXQiOjMwLCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0IjozMX0seyJpbnB1dCI6MzIsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjMzfSx7ImlucHV0IjozNCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6MzV9LHsiaW5wdXQiOjM2LCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0IjozN30seyJpbnB1dCI6MzgsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjM5fSx7ImlucHV0Ijo0MCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6NDF9LHsiaW5wdXQiOjQyLCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0Ijo0M30seyJpbnB1dCI6NDQsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjQ1fSx7ImlucHV0Ijo0NiwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6NDd9LHsiaW5wdXQiOjQ4LCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0Ijo0OX0seyJpbnB1dCI6NTAsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjUxfSx7ImlucHV0Ijo1MiwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6NTN9LHsiaW5wdXQiOjU0LCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0Ijo1NX0seyJpbnB1dCI6NTYsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjU3fSx7ImlucHV0Ijo1OCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6NTl9LHsiaW5wdXQiOjYwLCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0Ijo2MX0seyJpbnB1dCI6NjIsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjYzfSx7ImlucHV0Ijo2NCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6NjV9LHsiaW5wdXQiOjY2LCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0Ijo2N30seyJpbnB1dCI6NjgsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjY5fSx7ImlucHV0Ijo3MCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6NzF9XSwibmFtZSI6InN0YXRpYyJ9LHsiY2hhbm5lbHMiOlt7InNhbXBsZXIiOjAsInRhcmdldCI6eyJub2RlIjoyLCJwYXRoIjoicm90YXRpb24ifX0seyJzYW1wbGVyIjoxLCJ0YXJnZXQiOnsibm9kZSI6MywicGF0aCI6InJvdGF0aW9uIn19LHsic2FtcGxlciI6MiwidGFyZ2V0Ijp7Im5vZGUiOjQsInBhdGgiOiJyb3RhdGlvbiJ9fSx7InNhbXBsZXIiOjMsInRhcmdldCI6eyJub2RlIjo3LCJwYXRoIjoicm90YXRpb24ifX0seyJzYW1wbGVyIjo0LCJ0YXJnZXQiOnsibm9kZSI6NSwicGF0aCI6InJvdGF0aW9uIn19LHsic2FtcGxlciI6NSwidGFyZ2V0Ijp7Im5vZGUiOjYsInBhdGgiOiJyb3RhdGlvbiJ9fV0sInNhbXBsZXJzIjpbeyJpbnB1dCI6NzIsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjczfSx7ImlucHV0Ijo3NCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6NzV9LHsiaW5wdXQiOjc2LCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0Ijo3N30seyJpbnB1dCI6NzgsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjc5fSx7ImlucHV0Ijo4MCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6ODF9LHsiaW5wdXQiOjgyLCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0Ijo4M31dLCJuYW1lIjoiaWRsZSJ9LHsiY2hhbm5lbHMiOlt7InNhbXBsZXIiOjAsInRhcmdldCI6eyJub2RlIjoxLCJwYXRoIjoidHJhbnNsYXRpb24ifX0seyJzYW1wbGVyIjoxLCJ0YXJnZXQiOnsibm9kZSI6MiwicGF0aCI6InRyYW5zbGF0aW9uIn19LHsic2FtcGxlciI6MiwidGFyZ2V0Ijp7Im5vZGUiOjIsInBhdGgiOiJyb3RhdGlvbiJ9fSx7InNhbXBsZXIiOjMsInRhcmdldCI6eyJub2RlIjozLCJwYXRoIjoidHJhbnNsYXRpb24ifX0seyJzYW1wbGVyIjo0LCJ0YXJnZXQiOnsibm9kZSI6MywicGF0aCI6InJvdGF0aW9uIn19LHsic2FtcGxlciI6NSwidGFyZ2V0Ijp7Im5vZGUiOjUsInBhdGgiOiJyb3RhdGlvbiJ9fSx7InNhbXBsZXIiOjYsInRhcmdldCI6eyJub2RlIjo2LCJwYXRoIjoicm90YXRpb24ifX0seyJzYW1wbGVyIjo3LCJ0YXJnZXQiOnsibm9kZSI6NCwicGF0aCI6InJvdGF0aW9uIn19LHsic2FtcGxlciI6OCwidGFyZ2V0Ijp7Im5vZGUiOjcsInBhdGgiOiJyb3RhdGlvbiJ9fV0sInNhbXBsZXJzIjpbeyJpbnB1dCI6ODQsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjg1fSx7ImlucHV0Ijo4NiwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6ODd9LHsiaW5wdXQiOjg4LCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0Ijo4OX0seyJpbnB1dCI6OTAsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjkxfSx7ImlucHV0Ijo5MiwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6OTN9LHsiaW5wdXQiOjk0LCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0Ijo5NX0seyJpbnB1dCI6OTYsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjk3fSx7ImlucHV0Ijo5OCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6OTl9LHsiaW5wdXQiOjEwMCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6MTAxfV0sIm5hbWUiOiJ3YWxrIn0seyJjaGFubmVscyI6W3sic2FtcGxlciI6MCwidGFyZ2V0Ijp7Im5vZGUiOjMsInBhdGgiOiJ0cmFuc2xhdGlvbiJ9fSx7InNhbXBsZXIiOjEsInRhcmdldCI6eyJub2RlIjozLCJwYXRoIjoicm90YXRpb24ifX0seyJzYW1wbGVyIjoyLCJ0YXJnZXQiOnsibm9kZSI6MiwicGF0aCI6InRyYW5zbGF0aW9uIn19LHsic2FtcGxlciI6MywidGFyZ2V0Ijp7Im5vZGUiOjIsInBhdGgiOiJyb3RhdGlvbiJ9fSx7InNhbXBsZXIiOjQsInRhcmdldCI6eyJub2RlIjo1LCJwYXRoIjoicm90YXRpb24ifX0seyJzYW1wbGVyIjo1LCJ0YXJnZXQiOnsibm9kZSI6NiwicGF0aCI6InJvdGF0aW9uIn19LHsic2FtcGxlciI6NiwidGFyZ2V0Ijp7Im5vZGUiOjQsInBhdGgiOiJyb3RhdGlvbiJ9fSx7InNhbXBsZXIiOjcsInRhcmdldCI6eyJub2RlIjo3LCJwYXRoIjoicm90YXRpb24ifX1dLCJzYW1wbGVycyI6W3siaW5wdXQiOjEwMiwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6MTAzfSx7ImlucHV0IjoxMDQsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjEwNX0seyJpbnB1dCI6MTA2LCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0IjoxMDd9LHsiaW5wdXQiOjEwOCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6MTA5fSx7ImlucHV0IjoxMTAsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjExMX0seyJpbnB1dCI6MTEyLCJpbnRlcnBvbGF0aW9uIjoiTElORUFSIiwib3V0cHV0IjoxMTN9LHsiaW5wdXQiOjExNCwiaW50ZXJwb2xhdGlvbiI6IkxJTkVBUiIsIm91dHB1dCI6MTE1fSx7ImlucHV0IjoxMTYsImludGVycG9sYXRpb24iOiJMSU5FQVIiLCJvdXRwdXQiOjExN31dLCJuYW1lIjoianVtcCJ9XSwiYnVmZmVycyI6W3siYnl0ZUxlbmd0aCI6NTg4MzZ9XSwiYnVmZmVyVmlld3MiOlt7ImJ1ZmZlciI6MCwiYnl0ZUxlbmd0aCI6OTEyLCJieXRlU3RyaWRlIjoxMiwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjkxMiwiYnl0ZUxlbmd0aCI6OTEyLCJieXRlU3RyaWRlIjoxMiwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjE4MjQsImJ5dGVMZW5ndGgiOjEyMTYsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0IjozMDQwLCJieXRlTGVuZ3RoIjo2MDgsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0IjozNjQ4LCJieXRlTGVuZ3RoIjoxMzIsInRhcmdldCI6MzQ5NjN9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0IjozNzgwLCJieXRlTGVuZ3RoIjo5MTIsImJ5dGVTdHJpZGUiOjEyLCJ0YXJnZXQiOjM0OTYyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NDY5MiwiYnl0ZUxlbmd0aCI6OTEyLCJieXRlU3RyaWRlIjoxMiwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjU2MDQsImJ5dGVMZW5ndGgiOjEyMTYsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo2ODIwLCJieXRlTGVuZ3RoIjo2MDgsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo3NDI4LCJieXRlTGVuZ3RoIjoxMzIsInRhcmdldCI6MzQ5NjN9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo3NTYwLCJieXRlTGVuZ3RoIjo0MzQ0LCJieXRlU3RyaWRlIjoxMiwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjExOTA0LCJieXRlTGVuZ3RoIjo0MzQ0LCJieXRlU3RyaWRlIjoxMiwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjE2MjQ4LCJieXRlTGVuZ3RoIjo1NzkyLCJ0YXJnZXQiOjM0OTYyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6MjIwNDAsImJ5dGVMZW5ndGgiOjI4OTYsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0IjoyNDkzNiwiYnl0ZUxlbmd0aCI6MTA5MiwidGFyZ2V0IjozNDk2M30seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjI2MDI4LCJieXRlTGVuZ3RoIjoxNjA4LCJieXRlU3RyaWRlIjoxMiwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjI3NjM2LCJieXRlTGVuZ3RoIjoxNjA4LCJieXRlU3RyaWRlIjoxMiwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjI5MjQ0LCJieXRlTGVuZ3RoIjoyMTQ0LCJ0YXJnZXQiOjM0OTYyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6MzEzODgsImJ5dGVMZW5ndGgiOjEwNzIsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0IjozMjQ2MCwiYnl0ZUxlbmd0aCI6MjQwLCJ0YXJnZXQiOjM0OTYzfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6MzI3MDAsImJ5dGVMZW5ndGgiOjE2MDgsImJ5dGVTdHJpZGUiOjEyLCJ0YXJnZXQiOjM0OTYyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6MzQzMDgsImJ5dGVMZW5ndGgiOjE2MDgsImJ5dGVTdHJpZGUiOjEyLCJ0YXJnZXQiOjM0OTYyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6MzU5MTYsImJ5dGVMZW5ndGgiOjIxNDQsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0IjozODA2MCwiYnl0ZUxlbmd0aCI6MTA3MiwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjM5MTMyLCJieXRlTGVuZ3RoIjoyNDAsInRhcmdldCI6MzQ5NjN9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0IjozOTM3MiwiYnl0ZUxlbmd0aCI6MzA3MiwiYnl0ZVN0cmlkZSI6MTIsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo0MjQ0NCwiYnl0ZUxlbmd0aCI6MzA3MiwiYnl0ZVN0cmlkZSI6MTIsInRhcmdldCI6MzQ5NjJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo0NTUxNiwiYnl0ZUxlbmd0aCI6NDA5NiwidGFyZ2V0IjozNDk2Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjQ5NjEyLCJieXRlTGVuZ3RoIjoyMDQ4LCJ0YXJnZXQiOjM0OTYyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTE2NjAsImJ5dGVMZW5ndGgiOjcyMCwidGFyZ2V0IjozNDk2M30seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyMzgwLCJieXRlTGVuZ3RoIjo4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTIzODgsImJ5dGVMZW5ndGgiOjI0fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI0MTIsImJ5dGVMZW5ndGgiOjh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MjQyMCwiYnl0ZUxlbmd0aCI6MzJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MjQ1MiwiYnl0ZUxlbmd0aCI6OH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyNDYwLCJieXRlTGVuZ3RoIjoyNH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyNDg0LCJieXRlTGVuZ3RoIjo4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI0OTIsImJ5dGVMZW5ndGgiOjI0fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI1MTYsImJ5dGVMZW5ndGgiOjh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MjUyNCwiYnl0ZUxlbmd0aCI6MzJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MjU1NiwiYnl0ZUxlbmd0aCI6OH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyNTY0LCJieXRlTGVuZ3RoIjoyNH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyNTg4LCJieXRlTGVuZ3RoIjo4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI1OTYsImJ5dGVMZW5ndGgiOjI0fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI2MjAsImJ5dGVMZW5ndGgiOjh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MjYyOCwiYnl0ZUxlbmd0aCI6MzJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MjY2MCwiYnl0ZUxlbmd0aCI6OH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyNjY4LCJieXRlTGVuZ3RoIjoyNH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyNjkyLCJieXRlTGVuZ3RoIjo4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI3MDAsImJ5dGVMZW5ndGgiOjI0fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI3MjQsImJ5dGVMZW5ndGgiOjh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MjczMiwiYnl0ZUxlbmd0aCI6MzJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1Mjc2NCwiYnl0ZUxlbmd0aCI6OH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyNzcyLCJieXRlTGVuZ3RoIjoyNH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyNzk2LCJieXRlTGVuZ3RoIjo4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI4MDQsImJ5dGVMZW5ndGgiOjI0fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI4MjgsImJ5dGVMZW5ndGgiOjh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MjgzNiwiYnl0ZUxlbmd0aCI6MzJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1Mjg2OCwiYnl0ZUxlbmd0aCI6OH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyODc2LCJieXRlTGVuZ3RoIjoyNH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyOTAwLCJieXRlTGVuZ3RoIjo4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI5MDgsImJ5dGVMZW5ndGgiOjI0fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTI5MzIsImJ5dGVMZW5ndGgiOjh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1Mjk0MCwiYnl0ZUxlbmd0aCI6MzJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1Mjk3MiwiYnl0ZUxlbmd0aCI6OH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUyOTgwLCJieXRlTGVuZ3RoIjoyNH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUzMDA0LCJieXRlTGVuZ3RoIjo4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTMwMTIsImJ5dGVMZW5ndGgiOjI0fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTMwMzYsImJ5dGVMZW5ndGgiOjh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MzA0NCwiYnl0ZUxlbmd0aCI6MzJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MzA3NiwiYnl0ZUxlbmd0aCI6OH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUzMDg0LCJieXRlTGVuZ3RoIjoyNH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUzMTA4LCJieXRlTGVuZ3RoIjo4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTMxMTYsImJ5dGVMZW5ndGgiOjMyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTMxNDgsImJ5dGVMZW5ndGgiOjh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MzE1NiwiYnl0ZUxlbmd0aCI6MzJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MzE4OCwiYnl0ZUxlbmd0aCI6ODB9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1MzI2OCwiYnl0ZUxlbmd0aCI6MzIwfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTM1ODgsImJ5dGVMZW5ndGgiOjgwfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTM2NjgsImJ5dGVMZW5ndGgiOjMyMH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjUzOTg4LCJieXRlTGVuZ3RoIjo4MH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjU0MDY4LCJieXRlTGVuZ3RoIjozMjB9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NDM4OCwiYnl0ZUxlbmd0aCI6ODB9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NDQ2OCwiYnl0ZUxlbmd0aCI6MzIwfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTQ3ODgsImJ5dGVMZW5ndGgiOjUyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTQ4NDAsImJ5dGVMZW5ndGgiOjE1Nn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjU0OTk2LCJieXRlTGVuZ3RoIjo1Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjU1MDQ4LCJieXRlTGVuZ3RoIjoxNTZ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NTIwNCwiYnl0ZUxlbmd0aCI6NTJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NTI1NiwiYnl0ZUxlbmd0aCI6MjA4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTU0NjQsImJ5dGVMZW5ndGgiOjUyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTU1MTYsImJ5dGVMZW5ndGgiOjE1Nn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjU1NjcyLCJieXRlTGVuZ3RoIjo1Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjU1NzI0LCJieXRlTGVuZ3RoIjoyMDh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NTkzMiwiYnl0ZUxlbmd0aCI6NTJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NTk4NCwiYnl0ZUxlbmd0aCI6MjA4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTYxOTIsImJ5dGVMZW5ndGgiOjUyfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTYyNDQsImJ5dGVMZW5ndGgiOjIwOH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjU2NDUyLCJieXRlTGVuZ3RoIjo1Mn0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjU2NTA0LCJieXRlTGVuZ3RoIjoyMDh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NjcxMiwiYnl0ZUxlbmd0aCI6NTJ9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1Njc2NCwiYnl0ZUxlbmd0aCI6MjA4fSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTY5NzIsImJ5dGVMZW5ndGgiOjh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1Njk4MCwiYnl0ZUxlbmd0aCI6MjR9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NzAwNCwiYnl0ZUxlbmd0aCI6NjB9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NzA2NCwiYnl0ZUxlbmd0aCI6MjQwfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTczMDQsImJ5dGVMZW5ndGgiOjh9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NzMxMiwiYnl0ZUxlbmd0aCI6MjR9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NzMzNiwiYnl0ZUxlbmd0aCI6NjB9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1NzM5NiwiYnl0ZUxlbmd0aCI6MjQwfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTc2MzYsImJ5dGVMZW5ndGgiOjYwfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTc2OTYsImJ5dGVMZW5ndGgiOjI0MH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjU3OTM2LCJieXRlTGVuZ3RoIjo2MH0seyJidWZmZXIiOjAsImJ5dGVPZmZzZXQiOjU3OTk2LCJieXRlTGVuZ3RoIjoyNDB9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1ODIzNiwiYnl0ZUxlbmd0aCI6NjB9LHsiYnVmZmVyIjowLCJieXRlT2Zmc2V0Ijo1ODI5NiwiYnl0ZUxlbmd0aCI6MjQwfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTg1MzYsImJ5dGVMZW5ndGgiOjYwfSx7ImJ1ZmZlciI6MCwiYnl0ZU9mZnNldCI6NTg1OTYsImJ5dGVMZW5ndGgiOjI0MH1dLCJpbWFnZXMiOlt7InVyaSI6IlRleHR1cmVzL2NvbG9ybWFwLnBuZyIsIm5hbWUiOiJjb2xvcm1hcCJ9XSwibWF0ZXJpYWxzIjpbeyJwYnJNZXRhbGxpY1JvdWdobmVzcyI6eyJiYXNlQ29sb3JUZXh0dXJlIjp7ImluZGV4IjowLCJleHRlbnNpb25zIjp7IktIUl90ZXh0dXJlX3RyYW5zZm9ybSI6eyJ0ZXhDb29yZCI6MH19fSwibWV0YWxsaWNGYWN0b3IiOjAuMH0sImRvdWJsZVNpZGVkIjp0cnVlLCJuYW1lIjoiY29sb3JtYXAifV0sIm1lc2hlcyI6W3sicHJpbWl0aXZlcyI6W3siYXR0cmlidXRlcyI6eyJQT1NJVElPTiI6MCwiTk9STUFMIjoxLCJUQU5HRU5UIjoyLCJURVhDT09SRF8wIjozfSwiaW5kaWNlcyI6NCwibWF0ZXJpYWwiOjB9XSwibmFtZSI6ImxlZy1sZWZ0In0seyJwcmltaXRpdmVzIjpbeyJhdHRyaWJ1dGVzIjp7IlBPU0lUSU9OIjo1LCJOT1JNQUwiOjYsIlRBTkdFTlQiOjcsIlRFWENPT1JEXzAiOjh9LCJpbmRpY2VzIjo5LCJtYXRlcmlhbCI6MH1dLCJuYW1lIjoibGVnLXJpZ2h0In0seyJwcmltaXRpdmVzIjpbeyJhdHRyaWJ1dGVzIjp7IlBPU0lUSU9OIjoxMCwiTk9STUFMIjoxMSwiVEFOR0VOVCI6MTIsIlRFWENPT1JEXzAiOjEzfSwiaW5kaWNlcyI6MTQsIm1hdGVyaWFsIjowfV0sIm5hbWUiOiJ0b3JzbyJ9LHsicHJpbWl0aXZlcyI6W3siYXR0cmlidXRlcyI6eyJQT1NJVElPTiI6MTUsIk5PUk1BTCI6MTYsIlRBTkdFTlQiOjE3LCJURVhDT09SRF8wIjoxOH0sImluZGljZXMiOjE5LCJtYXRlcmlhbCI6MH1dLCJuYW1lIjoiYXJtLWxlZnQifSx7InByaW1pdGl2ZXMiOlt7ImF0dHJpYnV0ZXMiOnsiUE9TSVRJT04iOjIwLCJOT1JNQUwiOjIxLCJUQU5HRU5UIjoyMiwiVEVYQ09PUkRfMCI6MjN9LCJpbmRpY2VzIjoyNCwibWF0ZXJpYWwiOjB9XSwibmFtZSI6ImFybS1yaWdodCJ9LHsicHJpbWl0aXZlcyI6W3siYXR0cmlidXRlcyI6eyJQT1NJVElPTiI6MjUsIk5PUk1BTCI6MjYsIlRBTkdFTlQiOjI3LCJURVhDT09SRF8wIjoyOH0sImluZGljZXMiOjI5LCJtYXRlcmlhbCI6MH1dLCJuYW1lIjoiYW50ZW5uYSJ9XSwibm9kZXMiOlt7ImNoaWxkcmVuIjpbMV0sIm5hbWUiOiJjaGFyYWN0ZXIifSx7ImNoaWxkcmVuIjpbMiwzLDRdLCJ0cmFuc2xhdGlvbiI6WzAuMCwwLjAyMzc1LDkuMDIzODkyNjRFLTE3XSwibmFtZSI6InJvb3QifSx7Im1lc2giOjAsInRyYW5zbGF0aW9uIjpbMC4xMjUsMC4xNzYyNSwtMC4wMjM3NV0sIm5hbWUiOiJsZWctbGVmdCJ9LHsibWVzaCI6MSwidHJhbnNsYXRpb24iOlstMC4xMjUsMC4xNzYyNSwtMC4wMjM3NTAwMDE2XSwibmFtZSI6ImxlZy1yaWdodCJ9LHsiY2hpbGRyZW4iOls1LDYsN10sIm1lc2giOjIsInRyYW5zbGF0aW9uIjpbLTEuODA0Nzc4NjFFLTE1LDAuMTc2MjUsLTAuMDIzNzVdLCJuYW1lIjoidG9yc28ifSx7Im1lc2giOjMsInRyYW5zbGF0aW9uIjpbMC4zLDAuMTc1MDAwMDEyLDAuMF0sIm5hbWUiOiJhcm0tbGVmdCJ9LHsibWVzaCI6NCwidHJhbnNsYXRpb24iOlstMC4zLDAuMTE5NSwwLjBdLCJuYW1lIjoiYXJtLXJpZ2h0In0seyJtZXNoIjo1LCJ0cmFuc2xhdGlvbiI6WzAuMCwwLjYsMC4wXSwibmFtZSI6ImFudGVubmEifV0sInNhbXBsZXJzIjpbeyJtaW5GaWx0ZXIiOjk5ODd9XSwidGV4dHVyZXMiOlt7InNhbXBsZXIiOjAsInNvdXJjZSI6MCwibmFtZSI6ImNvbG9ybWFwIn1dfdTlAABCSU4AmpmZPSnNgb3NzEw9mpmZPZAz6L0AAAA+zcxMPc3MTL2amZk9zcxMPc3MzL2amRk+mpmZvSnNgb3NzEw9mpmZvc3MzD3NzEw9zcxMvc3MTL2amZk9zcxMvc3MzD2amZk9mpmZPSnNgb3NzEw9zcxMPc3MTL2amZk9mpmZPc3MzD3NzEw9zcxMPc3MzD2amZk9zcxMPc3MTL2amZk9zcxMvc3MTL2amZk9zcxMPc3MzD2amZk9zcxMvc3MzD2amZk9zcxMvc3MTL6amZm9zcxMPc3MTL6amZm9zcxMvc3MzD2amZm9zcxMPc3MzD2amZm9zcxMPc3MzD2amZm9zcxMPc3MTL6amZm9mpmZPc3MzD3NzEy9mpmZPc3MTL7NzEy9mpmZvSnNgb3NzEw9zcxMvc3MTL2amZk9mpmZvZAz6L0AAAA+zcxMvc3MzL2amRk+mpmZPc3MzD3NzEy9mpmZPc3MzD3NzEw9zcxMPc3MzD2amZm9zcxMPc3MzD2amZk9zcxMvc3MzD2amZm9zcxMvc3MzD2amZk9mpmZvc3MzD3NzEy9mpmZvc3MzD3NzEw9mpmZvc3MTL7NzEy9zcxMvc3MTL6amZm9mpmZvc3MzD3NzEy9zcxMvc3MzD2amZm9mpmZPc3MTL7NzEy9zcxMPc3MTL6amZm9mpmZPc3MTL4AAAA+zcxMPc3MTL6amRk+zcxMvc3MTL6amZm9zcxMvc3MTL6amRk+mpmZvc3MTL7NzEy9mpmZvc3MTL4AAAA+mpmZvc3MTL7NzEy9mpmZvc3MzD3NzEy9mpmZvc3MTL4AAAA+mpmZvSnNgb3NzEw9mpmZvZAz6L0AAAA+mpmZvc3MzD3NzEw9zcxMPc3MTL6amRk+zcxMvc3MTL6amRk+zcxMPc3MzL2amRk+zcxMvc3MzL2amRk+zcxMPc3MTL2amZk9zcxMPc3MzL2amRk+zcxMvc3MTL2amZk9zcxMvc3MzL2amRk+mpmZPc3MTL4AAAA+zcxMPc3MTL6amRk+mpmZPZAz6L0AAAA+zcxMPc3MzL2amRk+mpmZvc3MTL4AAAA+mpmZvZAz6L0AAAA+zcxMvc3MTL6amRk+zcxMvc3MzL2amRk+mpmZPc3MzD3NzEy9mpmZPc3MTL7NzEy9mpmZPc3MzD3NzEw9mpmZPSnNgb3NzEw9mpmZPc3MTL4AAAA+mpmZPZAz6L0AAAA+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zcxMvgAAAADNzEy+l5qKvinw7zzNzEw+l5qKvinw7zzNzEy+l5qKvinw7zzNzEy+mpmZvs3MzD3NzEy+l5qKvinw7zzNzEw+mpmZvs3MzD3NzEw+zcxMPinw7zyXmoo+zcxMPgAAAADNzEw+zcxMvinw7zyXmoo+zcxMvgAAAADNzEw+zcxMPinw7zyXmoo+zcxMvinw7zyXmoo+zcxMPs3MzD2amZk+zcxMvs3MzD2amZk+l5qKPs3MzD2Xmoo+zcxMPs3MzD2amZk+l5qKPpqZmT6Xmoo+zcxMPpqZmT6amZk+zcxMPgAAAADNzEy+zcxMPinw7zyXmoq+zcxMvgAAAADNzEy+zcxMvinw7zyXmoq+l5qKvinw7zzNzEw+mpmZvs3MzD3NzEw+AACAvinw7zwAAIA+l5qKvs3MzD2Xmoo+AACAvinw7zwAAIC+zcxMvinw7zyXmoq+l5qKvs3MzD2Xmoq+zcxMvs3MzD2amZm+zcxMPinw7zyXmoq+AACAPinw7zwAAIC+zcxMPs3MzD2amZm+l5qKPs3MzD2Xmoq+l5qKvs3MzD2Xmoq+mpmZvs3MzD3NzEy+AACAvinw7zwAAIC+l5qKvinw7zzNzEy+zcxMPs3MzD2amZm+l5qKPs3MzD2Xmoq+zcxMPpqZmT6amZm+l5qKPpqZmT6Xmoq+mpmZPpqZmT7NzEw+mpmZPs3MzD3NzEw+l5qKPpqZmT6Xmoo+l5qKPs3MzD2Xmoo+zcxMvinw7zyXmoo+AACAvinw7zwAAIA+zcxMvs3MzD2amZk+l5qKvs3MzD2Xmoo+mpmZPs3MzD3NzEw+l5qKPinw7zzNzEw+l5qKPs3MzD2Xmoo+AACAPinw7zwAAIA+l5qKPs3MzD2Xmoq+AACAPinw7zwAAIC+mpmZPs3MzD3NzEy+l5qKPinw7zzNzEy+AACAPinw7zwAAIA+zcxMPinw7zyXmoo+l5qKPs3MzD2Xmoo+zcxMPs3MzD2amZk+zcxMPs3MzD2amZk+zcxMvs3MzD2amZk+zcxMPpqZmT6amZk+zcxMvpqZmT6amZk+zcxMvs3MzD2amZm+zcxMPs3MzD2amZm+zcxMvpqZmT6amZm+zcxMPpqZmT6amZm+zcxMPgAAAADNzEw+zcxMPgAAAADNzEy+zcxMvgAAAADNzEw+zcxMvgAAAADNzEy+mpmZvs3MzD3NzEy+mpmZvpqZmT7NzEy+mpmZvs3MzD3NzEw+mpmZvpqZmT7NzEw+zcxMvpqZGT/NzEw+zcxMvhgaEj+Xmoo+AACAvhgaEj8AAIA+zcxMPhgaEj+Xmoq+AACAPhgaEj8AAIC+zcxMPpqZGT/NzEy+AACAPhgaEj8AAIC+l5qKPhgaEj/NzEy+zcxMPpqZGT/NzEy+zcxMvhgaEj+Xmoq+zcxMvpqZGT/NzEy+AACAvhgaEj8AAIC+zcxMvpqZGT/NzEw+AACAvhgaEj8AAIA+l5qKvhgaEj/NzEw+AACAvhgaEj8AAIC+zcxMvpqZGT/NzEy+l5qKvhgaEj/NzEy+zcxMPpqZGT/NzEw+AACAPhgaEj8AAIA+zcxMPhgaEj+Xmoo+l5qKPhgaEj/NzEw+AACAPhgaEj8AAIA+zcxMPpqZGT/NzEw+mpmZvpqZmT7NzEy+mpmZvgAAAD/NzEy+mpmZvpqZmT7NzEw+mpmZvgAAAD/NzEw+mpmZPgAAAD/NzEy+mpmZPpqZmT7NzEy+mpmZPgAAAD/NzEw+mpmZPpqZmT7NzEw+zcxMPpqZmT6amZm+l5qKPpqZmT6Xmoq+zcxMPgAAAD+amZm+l5qKPgAAAD+Xmoq+mpmZPgAAAD/NzEw+mpmZPpqZmT7NzEw+l5qKPgAAAD+Xmoo+l5qKPpqZmT6Xmoo+zcxMPpqZGT/NzEy+zcxMPpqZGT/NzEw+zcxMvpqZGT/NzEy+zcxMvpqZGT/NzEw+zcxMPpqZmT6amZk+zcxMvpqZmT6amZk+zcxMPgAAAD+amZk+zcxMvgAAAD+amZk+zcxMvgAAAD+amZm+zcxMPgAAAD+amZm+zcxMvhgaEj+Xmoq+zcxMPhgaEj+Xmoq+zcxMvpqZGT/NzEy+zcxMvpqZGT/NzEw+l5qKvhgaEj/NzEy+l5qKvhgaEj/NzEw+l5qKPhgaEj/NzEy+mpmZPgAAAD/NzEy+l5qKPhgaEj/NzEw+mpmZPgAAAD/NzEw+zcxMPpqZGT/NzEw+zcxMPhgaEj+Xmoo+zcxMvpqZGT/NzEw+zcxMvhgaEj+Xmoo+l5qKPgAAAD+Xmoq+l5qKPpqZmT6Xmoq+mpmZPgAAAD/NzEy+mpmZPpqZmT7NzEy+l5qKvpqZmT6Xmoq+zcxMvpqZmT6amZm+l5qKvgAAAD+Xmoq+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AACwPs59Fj8AAHg/7pk0PwAAeD+amTk/AAB4P+6ZND8AAHg/mpk5PwAAeD/umTQ/AAB4P+6ZND8AAHg/7pk0PwAAeD+amTk/AAB4P+6ZND8AAHg/mpk5PwAAeD/umTQ/AAB4P+6ZND8AAHg/mpk5PwAAeD/umTQ/AAB4P+6ZND8AAHg/7pk0PwAAeD/umTQ/AAB4P5qZOT8AAHg/7pk0PwAAeD/umTQ/AAB4P5qZOT8AAHg/7pk0PwAAeD/umTQ/AAB4P5qZOT8AAHg/iIgoPwAAeD+IiCg/AAB4P2ZmBj8AAHg/ZmYGPwAAeD+IiCg/AAB4P4iIKD8AAHg/ZmYGPwAAeD9mZgY/AAB4P2ZmBj8AAHg/iIgoPwAAeD9mZgY/AAB4P4iIKD8AAHg/7pk0PwAAeD/umTQ/AAB4P4iIKD8AAHg/iIgoPwAAeD+IiCg/AAB4P+6ZND8AAHg/iIgoPwAAeD/umTQ/AAB4P4iIKD8AAHg/ZmYGPwAAeD+IiCg/AAB4P2ZmBj8AAHg/iIgoPwAAeD9mZgY/AAB4P4iIKD8AAHg/ZmYGPwAAeD+IiCg/AAB4P4iIKD8AAHg/ZmYGPwAAeD9mZgY/AAB4P+6ZND8AAHg/7pk0PwAAeD+amTk/AAB4P5qZOT8AAHg/mpk5PwAAeD+amTk/AAB4P+6ZND8AAHg/7pk0PwAAeD/umTQ/AAB4P4iIKD8AAHg/7pk0PwAAeD+IiCg/AAB4P+6ZND8AAHg/mpk5PwAAeD/umTQ/AAB4P5qZOT8AAHg/7pk0PwAAeD/umTQ/AAB4P4iIKD8AAHg/iIgoPwAAeD+IiCg/AAB4P4iIKD8AAHg/ZmYGPwAAeD9mZgY/AAB4P5qZOT8AAHg/7pk0PwAAeD+amTk/AAB4P+6ZND8AAHg/7pk0PwAAeD+IiCg/AAB4P+6ZND8AAHg/iIgoPwAAeD/umTQ/AAB4P+6ZND8AAHg/iIgoPwAAeD+IiCg/AAB4P+6ZND8AAHg/7pk0PwAAeD+IiCg/AAB4P4iIKD8AAHg/iIgoPwAAeD+IiCg/AAB4P+6ZND8AAHg/7pk0PwAAeD+IiCg/AAB4P4iIKD8AAHg/ZmYGPwAAeD9mZgY/AAB4P2ZmBj8AAHg/iIgoPwAAeD9mZgY/AAB4P4iIKD8AAHg/7pk0PwAAeD/umTQ/AAB4P4iIKD8AAHg/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XgBdAFwAXQBeAF8AYgBhAGAAYQBiAGMAZgBlAGQAZQBmAGcAagBpAGgAaQBqAGsAbgBtAGwAbQBuAG8AcgBxAHAAcQByAHMAdgB1AHQAdQB2AHcAegB5AHgAeQB6AHsAfgB9AHwAfQB+AH8AggCBAIAAgQCCAIMAhgCFAIQAhQCGAIcAigCJAIgAiQCKAIsAjgCNAIwAjQCOAI8AkgCRAJAAkQCSAJMAlgCVAJQAlQCWAJcAmgCZAJgAmQCaAJsAngCdAJwAnQCeAJ8AogChAKAAoQCiAKMApgClAKQApQCmAKcAqgCpAKgAqQCqAKsArgCtAKwArQCuAK8AsgCxALAAsQCyALMAtgC1ALQAtQC2ALcAugC5ALgAuQC6ALsAvgC9ALwAvQC+AL8AwgDBAMAAwQDCAMMAxgDFAMQAxQDGAMcAygDJAMgAzQDMAMsA0ADPAM4A0wDSANEA1gDVANQA2QDYANcA3ADbANoA3wDeAN0A4gDhAOAA4QDiAOMA5gDlAOQA5QDmAOcA6gDpAOgA6QDqAOsA7gDtAOwA7QDuAO8A8gDxAPAA8QDyAPMA9gD1APQA9QD2APcA+gD5APgA+QD6APsA/gD9APwA/QD+AP8AAgEBAQABAQECAQMBBgEFAQQBBQEGAQcBCgEJAQgBCQEKAQsBDgENAQwBDQEOAQ8BEgERARABEQESARMBFgEVARQBFQEWARcBGgEZARgBGQEaARsBHgEdARwBHQEeAR8BIgEhASABIQEiASMBJgElASQBJQEmAScBKgEpASgBKQEqASsBLgEtASwBLQEuAS8BMgExATABMQEyATMBNgE1ATQBNQE2ATcBOgE5ATgBOQE6ATsBPgE9ATwBPQE+AT8BQgFBAUABQQFCAUMBRgFFAUQBRQFGAUcBSgFJAUgBSQFKAUsBTgFNAUwBTQFOAU8BUgFRAVABUQFSAVMBVgFVAVQBVQFWAVcBWgFZAVgBWQFaAVsBXgFdAVwBXQFeAV8BXwFeAWABXwFgAWEBYQFgAWIBYQFiAWMBYwFiAWQBYwFkAWUBYwFlAWYBZgFlAWcBZgFnAWgBaAFnAWkBKot9PoF/JTyamZk9Kot9PgAAgL2amZk9Kot9PoF/JTwAAAA+Kot9PgAAgL0AAAA+MzMzPgAAgL2amZk9MzMzPoF/JTyamZk9L19YPgAAgL0AAAA+L19YPoF/JTwAAAA+Kot9PgAAgL0AAAA+Kot9PgAAgL2amZk9L19YPgAAgL0AAAA+MzMzPgAAgL2amZk9zcxMPQAAgL2amZm9zcxMPQAAgL2amZk9mpmZPgAAgL2amZm9mpmZPgAAgL2amZk9Kot9PoF/JTyamZk9Kot9PoF/JTwAAAA+MzMzPoF/JTyamZk9L19YPoF/JTwAAAA+L19YPgAAgL0AAAA+L19YPoF/JTwAAAA+Kot9PgAAgL0AAAA+Kot9PoF/JTwAAAA+mpmZPpqZGT2amZm9mpmZPgAAgL2amZm9mpmZPpqZGT2amZk9mpmZPgAAgL2amZk9zcyMPgAAgD2amZm9zcyMPgAAgD2amZk9zcxMPQAAgD2amZm9zcxMPQAAgD2amZk9mpmZPpqZGT2amZm9mpmZPpqZGT2amZk9zcyMPgAAgD2amZm9zcyMPgAAgD2amZk9mpmZPgAAgL2amZm9mpmZPpqZGT2amZm9zcxMPQAAgL2amZm9zcxMPQAAgD2amZm9zcyMPgAAgD2amZm9mpmZPgAAgL2amZk9Kot9PgAAgL2amZk9mpmZPpqZGT2amZk9Kot9PoF/JTyamZk9MzMzPoF/JTyamZk9zcxMPQAAgD2amZk9zcyMPgAAgD2amZk9zcxMPQAAgL2amZk9MzMzPgAAgL2amZk9zcxMPQAAAD6amZm9zcxMPQAAAD6amZk9zcxMvQAAAD6amZm9zcxMvQAAAD6amZk9zcxMPQAAAL6amZk9zcxMPQAAAL6amZm9zcxMvQAAAL6amZk9zcxMvQAAAL6amZm9zcxMPZqZmT0AAAA+zcxMvZqZmT0AAAA+zcxMPQAAAD6amZk9zcxMvQAAAD6amZk9zcxMvQAAAL6amZk9zcxMvZqZmb0AAAA+zcxMPQAAAL6amZk9zcxMPZqZmb0AAAA+zcxMvQAAAL6amZm9zcxMPQAAAL6amZm9zcxMvZqZmb0AAAC+zcxMPZqZmb0AAAC+zcxMvZqZmT0AAAC+zcxMPZqZmT0AAAC+zcxMvQAAAD6amZm9zcxMPQAAAD6amZm9zcxMPZqZmT0AAAC+zcxMPZqZmb0AAAC+zcxMPQAAAD6amZm9zcxMPQAAgD2amZm9zcxMPQAAgL2amZm9zcxMPQAAAL6amZm9zcxMPQAAgD2amZk9zcxMPQAAAD6amZk9zcxMPQAAgL2amZk9zcxMPZqZmT0AAAA+zcxMPQAAAL6amZk9zcxMPZqZmb0AAAA+zcxMvZqZmb0AAAC+zcxMPZqZmb0AAAC+zcxMvZqZmT0AAAC+zcxMPZqZmT0AAAC+zcxMvZqZmb0AAAA+zcxMvZqZmT0AAAA+zcxMPZqZmb0AAAA+zcxMPZqZmT0AAAA+mpkZvmZmZr0AAMC9mpkZvmZmZj0AAMC9mpkZvgAAwL1mZma9mpkZvgAAwD1mZma9mpkZvgAAwL1mZmY9mpkZvgAAwD1mZmY9mpkZvmZmZj0AAMA9mpkZvmZmZr0AAMA9zcxMvQAAAL6amZk9mpkZvgAAwL1mZmY9zcxMvZqZmb0AAAA+mpkZvmZmZr0AAMA9zcxMvZqZmb0AAAA+mpkZvmZmZr0AAMA9zcxMvZqZmT0AAAA+mpkZvmZmZj0AAMA9mpkZvmZmZj0AAMA9mpkZvgAAwD1mZmY9zcxMvZqZmT0AAAA+zcxMvQAAAD6amZk9zcxMvZqZmb0AAAC+zcxMvZqZmT0AAAC+mpkZvmZmZr0AAMC9mpkZvmZmZj0AAMC9zcxMvQAAAD6amZm9zcxMvQAAAD6amZk9mpkZvgAAwD1mZma9mpkZvgAAwD1mZmY9zcxMvQAAAD6amZm9mpkZvgAAwD1mZma9zcxMvZqZmT0AAAC+mpkZvmZmZj0AAMC9zcxMvQAAAL6amZm9zcxMvZqZmb0AAAC+mpkZvgAAwL1mZma9mpkZvmZmZr0AAMC9zcxMvQAAAL6amZk9zcxMvQAAAL6amZm9mpkZvgAAwL1mZmY9mpkZvgAAwL1mZma9AACAPwAAAAAAAAAAAACAPwAAAAAAAAAA8wQ1PwAAAADzBDU/8wQ1PwAAAADzBDU/HilPvwAAAACuZhY/HilPvwAAAACuZhY/uYXovgAAAADWE2Q/uYXovgAAAADWE2Q/AAAAgAAAgL8AAAAAAAAAgAAAgL8AAAAAAAAAgAAAgL8AAAAAAAAAgAAAgL8AAAAAAAAAgAAAgL8AAAAAAAAAgAAAgL8AAAAA8wQ1P/MENb8AAAAA8wQ1P/MENb8AAAAAAAAAgAAAgD8AAAAAAAAAgAAAgD8AAAAAAAAAgAAAgD8AAAAAAAAAgAAAgD8AAAAAuYXovgAAAADWE2Q/uYXovgAAAADWE2Q/8wQ1PwAAAADzBDU/8wQ1PwAAAADzBDU/XoNsPxXvwz4AAAAA8wQ1P/MENb8AAAAAXoNsPxXvwz4AAAAA8wQ1P/MENb8AAAAAFe/DPl6DbD8AAAAAFe/DPl6DbD8AAAAAAAAAgAAAgD8AAAAAAAAAgAAAgD8AAAAAXoNsPxXvwz4AAAAAXoNsPxXvwz4AAAAAFe/DPl6DbD8AAAAAFe/DPl6DbD8AAAAAAAAAgAAAAAAAAIC/AAAAgAAAAAAAAIC/AAAAgAAAAAAAAIC/AAAAgAAAAAAAAIC/AAAAgAAAAAAAAIC/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgF6DbD8V78O+AAAAgF6DbD8V78M+AAAAgF6DbD8V78O+AAAAgF6DbD8V78M+AAAAgF6DbL8V78M+AAAAgF6DbL8V78O+AAAAgF6DbL8V78M+AAAAgF6DbL8V78O+AAAAgBXvwz5eg2w/AAAAgBXvwz5eg2w/AAAAgF6DbD8V78M+AAAAgF6DbD8V78M+AAAAgF6DbL8V78M+AAAAgBXvw75eg2w/AAAAgF6DbL8V78M+AAAAgBXvw75eg2w/AAAAgF6DbL8V78O+AAAAgF6DbL8V78O+AAAAgBXvw75eg2y/AAAAgBXvw75eg2y/AAAAgBXvwz5eg2y/AAAAgBXvwz5eg2y/AAAAgF6DbD8V78O+AAAAgF6DbD8V78O+AACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAAAAgBXvw75eg2y/AAAAgBXvw75eg2y/AAAAgBXvwz5eg2y/AAAAgBXvwz5eg2y/AAAAgBXvw75eg2w/AAAAgBXvwz5eg2w/AAAAgBXvw75eg2w/AAAAgBXvwz5eg2w/AACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAOd2tvpJvXb/wJ70+t0mtvn/SX7/TILI+Od2tvvAnvb6Sb10/t0mtvtMgsr5/0l8/Od2tvvAnvb6Sb10/t0mtvtMgsr5/0l8/Od2tvvAnvT6Sb10/t0mtvtMgsj5/0l8/t0mtvtMgsj5/0l8/t0mtvn/SXz/TILI+Od2tvvAnvT6Sb10/Od2tvpJvXT/wJ70+Od2tvvAnvb6Sb12/Od2tvvAnvT6Sb12/t0mtvtMgsr5/0l+/t0mtvtMgsj5/0l+/Od2tvpJvXT/wJ72+Od2tvpJvXT/wJ70+t0mtvn/SXz/TILK+t0mtvn/SXz/TILI+Od2tvpJvXT/wJ72+t0mtvn/SXz/TILK+Od2tvvAnvT6Sb12/t0mtvtMgsj5/0l+/Od2tvpJvXb/wJ72+Od2tvvAnvb6Sb12/t0mtvn/SX7/TILK+t0mtvtMgsr5/0l+/Od2tvpJvXb/wJ70+Od2tvpJvXb/wJ72+t0mtvn/SX7/TILI+t0mtvn/SX7/TILK+AAAAgAAAAAAAAIC/AACAPwAAAIAAAAAAAACAvwAAgD/0BDU/AAAAAPMENb8AAIA/9AQ1PwAAAADzBDW/AACAP65mFj8AAAAAHilPPwAAgD+vZhY/AAAAAB4pTz8AAIA/1hNkPwAAAAC5heg+AACAP9YTZD8AAAAAuIXoPgAAgD8AAIA/AAAAAAAAAAAAAIA/AACAPwAAAAAAAAAAAACAPwAAgD8AAAAAAAAAAAAAgD8AAIA/AAAAAAAAAAAAAIA/AACAPwAAAAAAAAAAAACAPwAAgD8AAAAAAAAAAAAAgD/xBDU/9QQ1PwAAAAAAAIA/8wQ1P/QENT8AAAAAAACAPwAAgL8AAAAAAAAAAAAAgD8AAIC/AAAAAAAAAAAAAIA/AACAvwAAAAAAAAAAAACAPwAAgL8AAAAAAAAAAAAAgD/VE2Q/AAAAALqF6D4AAIA/1RNkPwAAAAC6heg+AACAP/IENT8AAAAA9AQ1vwAAgD/yBDU/AAAAAPQENb8AAIA/AAAAgAAAAAAAAIC/AACAPwAAAIAAAAAAAACAvwAAgD8AAACAAAAAAAAAgL8AAIA/AAAAgAAAAAAAAIC/AACAP16DbL8W78M+AAAAAAAAgD9eg2y/Fe/DPgAAAAAAAIA/AACAvwAAAAAAAAAAAACAPwAAgL8AAAAAAAAAAAAAgD8AAACAAAAAAAAAgL8AAIA/AAAAgAAAAAAAAIC/AACAPwAAAIAAAAAAAACAvwAAgD8AAACAAAAAAAAAgL8AAIA/AACAvwAAAAAAAAAAAACAPwAAgL8AAAAAAAAAAAAAgD8AAIC/AAAAAAAAAAAAAIA/AACAvwAAAAAAAAAAAACAPwAAgL8AAAAAAAAAAAAAgD8AAIA/AAAAAAAAAAAAAIA/AACAPwAAAAAAAAAAAACAPwAAgD8AAAAAAAAAAAAAgD8AAIA/AAAAAAAAAAAAAIA/AACAPwAAAAAAAAAAAACAPwAAgD8AAAAAAAAAAAAAgD8AAIA/AAAAAAAAAAAAAIA/AACAPwAAAAAAAAAAAACAPwAAgD8AAAAAAAAAAAAAgD8AAIC/AAAAAAAAAAAAAIA/AACAvwAAAAAAAAAAAACAPwAAgL8AAAAAAAAAAAAAgD8AAIC/AAAAAAAAAAAAAIA/AACAPwAAAAAAAAAAAACAPwAAgD8AAAAAAAAAAAAAgD8AAIA/AAAAAAAAAAAAAIA/AACAPwAAAAAAAAAAAACAPwAAgD8AAAAAAAAAAAAAgD8AAIA/AAAAAAAAAAAAAIA/AACAPwAAAAAAAAAAAACAPwAAgD8AAAAAAAAAAAAAgD8AAIA/AAAAAAAAAAAAAIA/AACAPwAAAAAAAAAAAACAPwAAgD8AAAAAAAAAAAAAgD8AAIA/AAAAAAAAAAAAAIA/AACAvwAAAAAAAAAAAACAPwAAgL8AAAAAAAAAAAAAgD8AAIC/AAAAAAAAAAAAAIA/AACAvwAAAAAAAAAAAACAPwAAgL8AAAAAAAAAAAAAgD8AAIC/AAAAAAAAAAAAAIA/AACAvwAAAAAAAAAAAACAPwAAgL8AAAAAAAAAAAAAgD8AAACAAAAAAAAAgL8AAIA/AAAAgAAAAAAAAIC/AACAPwAAAIAAAAAAAACAvwAAgD8AAACAAAAAAAAAgL8AAIA/AAAAgAAAAAAAAIC/AACAPwAAAIAAAAAAAACAvwAAgD8AAACAAAAAAAAAgL8AAIA/AAAAgAAAAAAAAIC/AACAPwAAAIAAAAAAAACAvwAAgD8AAACAAAAAAAAAgL8AAIA/AAAAgAAAAAAAAIC/AACAPwAAAIAAAAAA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yMxMvQAAgD7KzMw9yMxMvc7MzD3IzEw9yMxMvc7MzD3TzEy9xM6uvdPK6j3IzEw9xM6uvdPK6j3TzEy9yMxMvZqZGT7KzMw9xM6uvZqZGT7Ezq49yMxMvQAAgD7KzMw9xM6uvQAAgD7Ezq49xM6uvdPK6j3TzEy9yszMvZqZGT7TzEy9xM6uvdPK6j3IzEw9yszMvZqZGT7IzEw9yszMvZqZGT7IzEw9yszMvQAAgD7IzEw9xM6uvZqZGT7Ezq49xM6uvQAAgD7Ezq49yMxMvZqZmT7TzEy9yMxMvZqZmT7IzEw9xM6uvRgakj7TzEy9xM6uvRgakj7IzEw9yszMvQAAgD7TzEy9xM6uvRgakj7TzEy9yszMvQAAgD7IzEw9xM6uvRgakj7IzEw9nZmZPdPK6j2WmZk908xMPdPK6j3Ezq49y86uPZqZGT7Ezq4908xMPZqZGT7KzMw90MzMPZqZGT7IzEw9y86uPdPK6j3IzEw9y86uPZqZGT7Ezq49nZmZPdPK6j2WmZk9y86uPRgakj7IzEw90MzMPQAAgD7IzEw9nZmZPRgakj6WmZk9y86uPQAAgD7Ezq49y86uPQAAgD7Ezq4908xMPQAAgD7KzMw9nZmZPRgakj6WmZk908xMPRgakj7Ezq4908xMPc7MzD3TzEy908xMPdPK6j3Lzq69yMxMvc7MzD3TzEy9yMxMvdPK6j3Lzq69xM6uvZqZGT7Lzq69yMxMvZqZGT7QzMy9xM6uvQAAgD7Lzq69yMxMvQAAgD7QzMy9yMxMvQAAgD7QzMy908xMPQAAgD7QzMy9yMxMvRgakj7Lzq6908xMPRgakj7Lzq69xM6uvZqZGT7Lzq69xM6uvQAAgD7Lzq69yszMvZqZGT7TzEy9yszMvQAAgD7TzEy9y86uPQAAgD7Lzq69y86uPZqZGT7Lzq690MzMPQAAgD7TzEy90MzMPZqZGT7TzEy908xMPZqZGT7QzMy9y86uPZqZGT7Lzq6908xMPQAAgD7QzMy9y86uPQAAgD7Lzq69yMxMvdPK6j3Lzq6908xMPdPK6j3Lzq69yMxMvZqZGT7QzMy908xMPZqZGT7QzMy908xMPRgakj7Lzq6908xMPZqZmT7TzEy9yMxMvRgakj7Lzq69yMxMvZqZmT7TzEy9y86uPdPK6j3IzEw9y86uPdPK6j3TzEy9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",Vh="data:image/png;base64,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";var st=s=>document.getElementById(s),sn=s=>String(s??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Fi=s=>new Promise(e=>setTimeout(e,s)),fa=8,Kh=["A","B","C","D","E","F"];function $h(s){let e=s>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}var xv=["\u0418\u0432\u0430\u043D\u043E\u0432","\u041F\u0435\u0442\u0440\u043E\u0432","\u0421\u043C\u0438\u0440\u043D\u043E\u0432","\u041A\u0443\u0437\u043D\u0435\u0446\u043E\u0432","\u041F\u043E\u043F\u043E\u0432","\u0421\u043E\u043A\u043E\u043B\u043E\u0432","\u041B\u0435\u0431\u0435\u0434\u0435\u0432","\u041A\u043E\u0437\u043B\u043E\u0432","\u041D\u043E\u0432\u0438\u043A\u043E\u0432","\u041C\u043E\u0440\u043E\u0437\u043E\u0432","\u0412\u043E\u043B\u043A\u043E\u0432","\u0415\u0433\u043E\u0440\u043E\u0432","\u041F\u0430\u0432\u043B\u043E\u0432","\u041E\u0440\u043B\u043E\u0432","\u041C\u0430\u043A\u0430\u0440\u043E\u0432","\u0422\u0438\u0442\u043E\u0432","\u0417\u0443\u0435\u0432","\u0424\u043E\u043C\u0438\u043D","\u041A\u043E\u0442\u043E\u0432","\u0411\u044B\u043A\u043E\u0432","\u041F\u0430\u043D\u043E\u0432","\u0421\u0430\u0432\u0438\u043D","\u041B\u0443\u043A\u0438\u043D","\u0420\u044F\u0431\u043E\u0432","\u0413\u0440\u043E\u043C\u043E\u0432","\u0416\u0443\u043A\u043E\u0432"];function wv(s){let e=$h(s*7919+41),t=l=>l[Math.floor(e()*l.length)],n=[];for(let l=1;l<=fa;l++)for(let u of Kh)n.push(l+u);let i=[],r=1,o=new Set,a=new Set;for(;o.size<8;)o.add(Math.floor(e()*n.length));let A=[...o];a.add(A[7]);let c;do c=Math.floor(e()*n.length);while(o.has(c));return a.add(c),n.forEach((l,u)=>{if(!o.has(u)&&u!==c&&e()<.2)return;let h=o.has(u),d=a.has(u)?null:h?u===A[0]?2012:2013+Math.floor(e()*8):e()<.15?1944+Math.floor(e()*15):1965+Math.floor(e()*40),p=e()<.5;i.push({id:r++,seat:l,full_name:`${t(xv)}${p?"\u0430":""} ${"\u0410\u0411\u0412\u0413\u0414\u0415\u0418\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422"[Math.floor(e()*16)]}.`,birth_year:d,fare_class:"\u044D\u043A\u043E\u043D\u043E\u043C",meal:null,kid:h,female:p,old:d!=null&&d<1960})}),i}var yv=`CREATE TABLE passenger (
  id         integer     PRIMARY KEY,
  seat       varchar(3)  NOT NULL,
  full_name  varchar(60) NOT NULL,
  birth_year integer,
  fare_class varchar(10) NOT NULL,
  meal       varchar(20) CONSTRAINT ck_passenger_meal
             CHECK (meal IN ('\u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442', '\u0434\u0435\u0442\u0441\u043A\u043E\u0435', '\u0432\u0435\u0433\u0435\u0442\u0430\u0440\u0438\u0430\u043D\u0441\u043A\u043E\u0435', '\u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D'))
);`,ra=s=>s===null?"NULL":typeof s=="number"?String(s):"'"+String(s).replace(/'/g,"''")+"'",br=["id","seat","full_name","birth_year","fare_class","meal"],on=new To({antialias:!0,alpha:!0});on.setPixelRatio(Math.min(2,window.devicePixelRatio));on.shadowMap.enabled=!0;on.shadowMap.type=Tc;on.toneMapping=Ic;on.toneMappingExposure=1.05;on.outputColorSpace=gt;st("stage").appendChild(on.domElement);var pa=new sa;pa.domElement.className="labels";st("stage").appendChild(pa.domElement);var Ye=new Io,_n=new ci(-10,10,6,-6,.1,200),Qe={tx:2.6,ty:0,tz:0,zoom:1,ax:9,ay:0,cx:3.2,cy:0,cz:0,curZoom:1},_v=new b(1.05,1.25,1.35).normalize();Ye.add(new Ho(16774370,10465986,1.25));var Qn=new Ui(16773336,2.2);Qn.position.set(-6,14,9);Qn.castShadow=!0;Qn.shadow.mapSize.set(2048,2048);Object.assign(Qn.shadow.camera,{left:-12,right:12,top:10,bottom:-10,near:1,far:40});Qn.shadow.radius=4;Qn.shadow.bias=-6e-4;Ye.add(Qn);Ye.add(Qn.target);Qn.target.position.set(3.5,0,0);var ed=new Ui(14214911,.5);ed.position.set(10,6,-8);Ye.add(ed);var Mi=(s,e={})=>new li({color:s,roughness:e.r??.78,metalness:0,...e}),ot=(s,e,t,n,i,r)=>{let o=new At(new ia(s,e,t,3,Math.min(n,s/2-.001,e/2-.001,t/2-.001)),typeof i=="object"?i:Mi(i,r));return o.castShadow=!0,o.receiveShadow=!0,o},qe=(s,e,t,n)=>(s.position.set(e,t,n),s),Tv=1.12,Iv=0,ma={A:-2,B:-1.42,C:-.84,D:.84,E:1.42,F:2},Wn=s=>Iv+(s-1)*Tv,Tn=-2.9,ga=Wn(fa)+1.3,vi=(Tn+ga)/2,Jn=ga-Tn,Ma=new At(new Ni(160,160),Mi(14472905,{r:1}));Ma.rotation.x=-Math.PI/2;Ma.position.y=-1.35;Ma.receiveShadow=!0;Ye.add(Ma);var td=ot(Jn+.5,1.3,6.1,.45,16513266);qe(td,vi,-.66,0);Ye.add(td);[-1,1].forEach(s=>{let e=ot(Jn+.52,.16,.06,.03,16761370);qe(e,vi,-.45,s*3.04),Ye.add(e);let t=new Ts;t.moveTo(0,0),t.lineTo(3.2,0),t.lineTo(4.6,5.6),t.lineTo(3.7,5.6),t.lineTo(0,0);let n=new mr(t,{depth:.12,bevelEnabled:!0,bevelThickness:.05,bevelSize:.05,bevelSegments:2}),i=new At(n,Mi(15659250));i.castShadow=!0,i.receiveShadow=!0,i.rotation.x=s*Math.PI/2,i.position.set(Wn(2.2),-.9,s*2.95),Ye.add(i);let r=ot(1.5,.6,.6,.28,14212577);qe(r,Wn(3.3),-1.1,s*4.7),Ye.add(r);let o=new Ts;o.moveTo(0,0),o.lineTo(1.4,0),o.lineTo(2.1,2),o.lineTo(1.5,2),o.lineTo(0,0);let a=new At(new mr(o,{depth:.1,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:2}),Mi(15659250));a.castShadow=!0,a.rotation.x=s*Math.PI/2,a.position.set(ga-1.5,-.7,s*2.95),Ye.add(a)});var Er=new At(new gr(3.05,32,16,0,Math.PI*2,0,Math.PI/2),Mi(16513266));Er.scale.set(.213,.55,1);Er.rotation.z=Math.PI/2;qe(Er,Tn-.1,-.66,0);Er.castShadow=!0;Ye.add(Er);var nd=ot(Jn,.12,5.9,.05,15657178);qe(nd,vi,-.06,0);Ye.add(nd);var id=ot(Jn-.2,.02,1.05,.01,4871812);qe(id,vi,.01,0);Ye.add(id);for(let s=0;s<12;s++){let e=ot(.16,.021,.04,.01,16761370,{emissive:3351040});qe(e,Tn+.6+s*(Jn-1.2)/11,.02,.44),Ye.add(e);let t=e.clone();t.position.z=-.44,Ye.add(t)}var sd=ot(Jn,1.55,.16,.06,16250094);qe(sd,vi,.72,-2.95);Ye.add(sd);var rd=ot(Jn,.42,.16,.06,16250094);qe(rd,vi,.17,2.95);Ye.add(rd);for(let s=1;s<=fa;s++){let e=ot(.42,.5,.04,.14,10470360,{r:.25,emissive:2373706,emissiveIntensity:.25});qe(e,Wn(s)-.1,.85,-2.86),Ye.add(e)}var od=ot(Jn,.08,.2,.03,16761370);qe(od,vi,1.5,-2.95);Ye.add(od);var ad=ot(.16,1.55,5.9,.06,16250094);qe(ad,ga,.72,0);Ye.add(ad);var Ad=ot(.9,1,1.7,.08,14472904);qe(Ad,Tn+.55,.5,-1.9);Ye.add(Ad);var cd=ot(.5,.7,.4,.06,12173512);qe(cd,Tn+.5,.35,1.6);Ye.add(cd);var ld=ot(.06,.34,1.1,.03,2566444);qe(ld,Tn+.02,1.25,0);Ye.add(ld);var Pv=3108723,bv=2513502,Ev=15525590,Cv={};for(let s=1;s<=fa;s++)for(let e of Kh){let t=new zt,n=ot(.5,.16,.5,.06,Pv);qe(n,0,.32,0),t.add(n);let i=ot(.12,.66,.5,.05,bv);qe(i,.25,.66,0),t.add(i);let r=ot(.13,.16,.36,.04,Ev);qe(r,.26,.93,0),t.add(r);let o=ot(.32,.24,.08,.03,7173242);qe(o,.02,.12,0),t.add(o),[-1,1].forEach(a=>{let A=ot(.4,.06,.06,.02,4147021);qe(A,.06,.48,a*.27),t.add(A)}),qe(t,Wn(s),0,ma[e]),Ye.add(t),Cv[s+e]=t}var Hh=[11883067,3108723,13210923,3886458,7174714,8014699,5205386,13662794,5933679,9062986,6050928],jh=[15845797,14724228,13011554,16111292,11039055],Xh=[2827296,4863014,8018490,1907738,12160090,9390634];function Sv(s,e){let t=new zt,n=Hh[Math.floor(e()*Hh.length)],i=jh[Math.floor(e()*jh.length)],r=s.old?14276304:Xh[Math.floor(e()*Xh.length)],o=ot(.34,.44,.38,.1,n);qe(o,.05,.62,0),t.add(o);let a=ot(.38,.14,.3,.06,4014672);qe(a,-.14,.45,0),t.add(a),[-1,1].forEach(u=>{let h=ot(.28,.1,.1,.045,n);qe(h,-.06,.58,u*.23),t.add(h);let d=ot(.08,.08,.08,.03,i);qe(d,-.22,.58,u*.23),t.add(d)});let A=ot(.3,.3,.3,.1,i);qe(A,.02,1,0),t.add(A);let c=ot(.32,s.female?.2:.12,.33,.06,r);if(qe(c,.06,s.female?1.1:1.13,0),t.add(c),s.female&&!s.kid){let u=ot(.1,.26,.26,.05,r);qe(u,.17,.92,0),t.add(u)}[-1,1].forEach(u=>{let h=ot(.035,.055,.05,.015,1907738);qe(h,-.13,1.01,u*.07),t.add(h)});let l=s.kid?.66:1;return t.scale.setScalar(l),t.position.set(Wn(parseInt(s.seat,10))-.02,s.kid?.08:0,ma[s.seat.slice(-1)]),t.userData.p=s,t.userData.base=t.position.clone(),t.userData.s=l,t.traverse(u=>{u.isMesh&&(u.userData.pid=s.id)}),t}var Dv={\u0434\u0435\u0442\u0441\u043A\u043E\u0435:16761370,\u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442:9080982,\u0432\u0435\u0433\u0435\u0442\u0430\u0440\u0438\u0430\u043D\u0441\u043A\u043E\u0435:5941358,\u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D:11883067};function Lv(s){let e=new zt,t=ot(.3,.035,.36,.015,16513266);e.add(t);let n=new At(new _s(.1,.1,.02,20),Mi(16777215));qe(n,0,.03,-.05),e.add(n);let i=new At(new gr(.085,20,10,0,Math.PI*2,0,Math.PI/2),Mi(Dv[s]||7032730,{r:.45}));qe(i,0,.04,-.05),i.castShadow=!0,e.add(i);let r=new At(new _s(.04,.035,.08,12),Mi(16777215));return qe(r,.02,.06,.11),r.castShadow=!0,e.add(r),e}var Ir=null,da=null,ud={},oa=null,Pt=new zt;Ye.add(Pt);Pt.position.set(Tn+1.2,0,0);var Ls=new At(new _s(.02,.32,1,16,1,!0),new Gt({color:16765773,transparent:!0,opacity:0,depthWrite:!1,side:Bt}));Ye.add(Ls);async function Rv(){let s=Uint8Array.from(atob(kh),n=>n.charCodeAt(0)),e=new Mr;e.setURLModifier(n=>/colormap\.png$/.test(n)?Vh:n);let t=await new Promise((n,i)=>new ta(e).parse(s.buffer,"",n,i));Ir=t.scene,Ir.scale.setScalar(1.25),Ir.traverse(n=>{n.isMesh&&(n.castShadow=!0,n.receiveShadow=!0)}),Pt.add(Ir),da=new Wo(Ir),t.animations.forEach(n=>{ud[n.name]=da.clipAction(n)}),fn("idle")}function fn(s,e){let t=ud[s];!t||oa===t||(t.reset(),t.setLoop(e?zc:Nc),t.clampWhenFinished=!!e,t.play(),oa&&oa.crossFadeTo(t,.18,!1),oa=t)}var Cr=document.createElement("div");Cr.className="rscreen";Cr.innerHTML="<b>\u0421\u0423\u0411\u0414</b><span>\u0436\u0434\u0443 \u043A\u043E\u043C\u0430\u043D\u0434\u0443</span>";var hd=new Ss(Cr);hd.position.set(0,1.75,0);Pt.add(hd);function aa(s,e){Cr.innerHTML=`<b>${s}</b>${e?`<span>${e}</span>`:""}`}function Gh(s){st("cmd").innerHTML=s||"",st("cmd").hidden=!s,Cr.style.visibility=s?"hidden":""}var Aa=[];function Os(s,e,t,n="io"){return new Promise(i=>{let r={};for(let o in e)r[o]=s[o];Aa.push({o:s,to:e,from:r,t0:performance.now(),ms:Math.max(1,t),ease:n,res:i})})}var zv={io:s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,out:s=>1-Math.pow(1-s,3),back:s=>1+(1.7+1)*Math.pow(s-1,3)+1.7*Math.pow(s-1,2),lin:s=>s};async function Yh(s,e){let t=s-Pt.position.x;Math.abs(t)<.01||(fn("walk"),Pt.userData.face=t>0?-Math.PI/2+Math.PI:-Math.PI/2,await Os(Pt.position,{x:s},e||Math.abs(t)/2.6*1e3/Nv(),"lin"),fn("idle"))}var Ds=null,ca=!1;function wn(s,e,t={}){if(ca)return;try{Ds=Ds||new AudioContext}catch{return}let n=Ds.currentTime+(t.at||0),i=Ds.createOscillator(),r=Ds.createGain();i.type=t.type||"sine",i.frequency.setValueAtTime(s,n),t.to&&i.frequency.exponentialRampToValueAtTime(t.to,n+e),r.gain.setValueAtTime(0,n),r.gain.linearRampToValueAtTime(t.vol||.12,n+.01),r.gain.exponentialRampToValueAtTime(.001,n+e),i.connect(r),r.connect(Ds.destination),i.start(n),i.stop(n+e+.02)}var mi={yes:()=>{wn(660,.08,{type:"triangle"}),wn(990,.1,{type:"triangle",at:.07})},no:()=>wn(220,.09,{type:"triangle",vol:.08}),unk:()=>{wn(440,.07,{vol:.08}),wn(415,.1,{vol:.08,at:.08})},pop:()=>wn(520,.09,{to:1e3,vol:.1}),ok:()=>[523,659,784,1046].forEach((s,e)=>wn(s,.2,{type:"triangle",at:e*.08})),err:()=>{wn(160,.3,{type:"square",vol:.1}),wn(120,.35,{type:"square",vol:.09,at:.15})},rew:()=>{for(let s=0;s<8;s++)wn(900-s*80,.05,{type:"square",vol:.05,at:s*.05})}},rn=null,Rs=[],Gn={},zs={},Pr={},gi=null,Yn=!1,Ns=1,Nv=()=>Ns,Wh=parseInt(new URLSearchParams(location.search).get("n")||"7",10);function la(s,e,t){Il(s);let n=document.createElement("div"),i=document.createElement("div");n.appendChild(i),i.className="chip "+e,i.textContent=e==="no"?"":t;let r=new Ss(n);r.inner=i;let o=Gn[s];r.position.set(0,1.45/o.userData.s,0),o.add(r),Pr[s]=r,i.animate([{transform:"scale(.5)"},{transform:"none"}],{duration:260,easing:"cubic-bezier(.3,1.6,.6,1)"})}function Il(s){let e=Pr[s];e&&(e.parent.remove(e),e.element.remove(),delete Pr[s])}function Ml(){Object.keys(Pr).forEach(Il)}function vl(s,e,t=""){ki();let n=document.createElement("div"),i=document.createElement("div");n.appendChild(i),i.className="rcard "+t,i.innerHTML=e,n.style.zIndex=20,gi=new Ss(n),gi.position.set(0,1.95/Gn[s].userData.s,0),Gn[s].add(gi)}function ki(){gi&&(gi.parent.remove(gi),gi.element.remove(),gi=null)}function xl(s,e,t){if(zs[s]&&(Ye.remove(zs[s]),delete zs[s]),!e)return;let n=Rs.find(o=>o.id===s),i=Lv(e),r=n.kid;i.position.set(Wn(parseInt(n.seat,10))-.32,r?.5:.56,ma[n.seat.slice(-1)]),Ye.add(i),zs[s]=i,t&&(i.scale.setScalar(.01),Os(i.scale,{x:1,y:1,z:1},380,"back"),i.position.y+=.5,Os(i.position,{y:i.position.y-.5},380,"out"))}async function dd(s,e=.25){let t=Gn[s],n=t.userData.base.y;await Os(t.position,{y:n+e},140,"out"),await Os(t.position,{y:n},200,"io")}async function wl(){Rs=wv(Wh),await rn.exec("DROP TABLE IF EXISTS passenger;"+yv+"INSERT INTO passenger (id, seat, full_name, birth_year, fare_class, meal) VALUES "+Rs.map(e=>`(${e.id}, ${ra(e.seat)}, ${ra(e.full_name)}, ${ra(e.birth_year)}, ${ra(e.fare_class)}, NULL)`).join(",")+";"),Object.values(Gn).forEach(e=>Ye.remove(e)),Gn={},Object.keys(zs).forEach(e=>xl(+e,null)),Ml(),ki();let s=$h(Wh*31+5);Rs.forEach(e=>{let t=Sv(e,s);Ye.add(t),Gn[e.id]=t}),Pt.position.set(Tn+1.2,0,0),Pt.userData.face=-Math.PI/2,aa("\u0421\u0423\u0411\u0414","\u0436\u0434\u0443 \u043A\u043E\u043C\u0430\u043D\u0434\u0443"),st("result").innerHTML="",st("verdict").innerHTML="",ua(0,0,Rs.length)}function ua(s,e,t){st("cnt").innerHTML=`<b>${s}</b>/${t} \u043F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043E \xB7 <b>${e}</b> \u043F\u043E\u0434\u043E\u0448\u043B\u043E`}function Ov(s){let e=s.replace(/--[^\n]*/g," ").replace(/\s+/g," ").trim().replace(/;\s*$/,"");if(e.includes(";"))return{err:"\u0412 \u044D\u0442\u043E\u0439 \u043F\u0440\u043E\u0431\u0435 \u2014 \u043E\u0434\u043D\u0430 \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u0437\u0430 \u0440\u0430\u0437."};let t;if(t=/^update\s+passenger\s+set\s+([\s\S]+?)(?:\s+where\s+([\s\S]+))?$/i.exec(e)){let n=t[1].split(/,(?![^(]*\))/).map(i=>{let r=/^\s*(\w+)\s*=\s*([\s\S]+)$/.exec(i);return r?{col:r[1].toLowerCase(),expr:r[2].trim()}:null});return n.some(i=>!i)?{err:"\u041D\u0435 \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u043B SET: \u043D\u0443\u0436\u043D\u043E \xAB\u0441\u0442\u043E\u043B\u0431\u0435\u0446 = \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435\xBB."}:{kind:"UPDATE",sql:e,sets:n,where:t[2]||null}}return(t=/^select\s+([\s\S]+?)\s+from\s+passenger(?:\s+where\s+([\s\S]+?))?(?:\s+order\s+by\s+[\s\S]+)?$/i.exec(e))?{kind:"SELECT",sql:e,where:t[2]||null}:/^(delete|insert|drop|alter|create|truncate)/i.test(e)?{err:"\u0412 \u044D\u0442\u043E\u0439 \u043F\u0440\u043E\u0431\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442 SELECT \u0438 UPDATE \u0442\u0430\u0431\u043B\u0438\u0446\u044B passenger."}:{kind:"OTHER",sql:e}}var Bv=s=>s?br.filter(e=>new RegExp("\\b"+e+"\\b","i").test(s)):[],fd=s=>s==null?"NULL":String(s),Uv=(s,e)=>s.replace(/'(?:[^']|'')*'|\b[a-z_]+\b/gi,t=>t.startsWith("'")?t:br.includes(t.toLowerCase())?e[t.toLowerCase()]===null?"NULL":typeof e[t.toLowerCase()]=="number"?String(e[t.toLowerCase()]):"'"+e[t.toLowerCase()]+"'":t);async function yl(){if(Yn||!rn)return;let s=st("sql").value.trim();if(!s)return;let e=Ov(s);if(st("verdict").innerHTML="",e.err){st("result").innerHTML=`<span class="bad">${sn(e.err)}</span>`,mi.err();return}Yn=!0,st("runBtn").disabled=!0,Ml(),ki();try{if(e.kind==="OTHER"){let d=await rn.query(e.sql);st("result").innerHTML=`<span class="ok">${d.rows.length} \u0441\u0442\u0440\u043E\u043A</span>`;return}let t=Bv(e.where),n;try{let d=e.kind==="UPDATE"?e.sets.map((p,g)=>`, (${p.expr}) AS v${g}`).join(""):"";n=(await rn.query(`SELECT id, ${br.join(", ")}, ${e.where?`(${e.where})`:"true"} AS w${d} FROM passenger ORDER BY ctid`)).rows}catch(d){fn("idle"),aa("\u041E\u0428\u0418\u0411\u041A\u0410","\u043D\u0435 \u043F\u043E\u043D\u044F\u043B \u043A\u043E\u043C\u0430\u043D\u0434\u0443"),st("result").innerHTML=`<span class="bad">ERROR: ${sn(d.message)}</span><div class="ru">${sn(Qh(d))}</div>`,mi.err(),Vv();return}let i=null,r=null;if(e.kind==="UPDATE"){await rn.exec("BEGIN");try{await rn.query(e.sql)}catch(d){r=d;let p=/Failing row contains \((\d+),/.exec(d.detail||"");i=p?+p[1]:(n.find(g=>g.w)||{}).id}await rn.exec("ROLLBACK")}let o=e.kind==="UPDATE"?`UPDATE \xB7 SET ${e.sets.map(d=>`${d.col} = ${d.expr}`).join(", ")}`:"SELECT";Gh(`<span class="k">${sn(o)}</span><span class="w">${e.where?"WHERE "+sn(e.where):"\u0431\u0435\u0437 WHERE \u2014 \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442 \u043A\u0430\u0436\u0434\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430"}</span>`);let a=n.length,A=0,c=0,l=[];ua(0,0,a);for(let d of n){let p=Gn[d.id],g=Rs.find(M=>M.id===d.id),m=Ns>=50;m?Pt.position.x=Wn(parseInt(g.seat,10))-.05:(await Yh(Wn(parseInt(g.seat,10))-.05),Pt.userData.face=ma[g.seat.slice(-1)]<0?Math.PI:0,Fv(p));let f=d.w,T=f===!0?"yes":f===!1?"no":"unk",y=(t.length?t:["id"]).map(M=>`<div><span>${M}</span><b>${sn(fd(d[M]))}</b></div>`).join("")+(e.where?`<div class="rc-x">${sn(Uv(e.where,d))}</div>`:"");if(!m)for(vl(d.id,`<div class="rc-h">\u0441\u0442\u0440\u043E\u043A\u0430 ${d.id} \xB7 ${d.seat}</div>${y}<div class="rc-v ${T}">${T==="yes"?"\u0414\u0410":T==="no"?"\u041D\u0415\u0422":"NULL \u2014 \u043D\u0435 \u0437\u043D\u0430\u044E"}</div>`,T),mi[T](),await Fi(Math.max(80,520/Ns));window.PROTO.holdAt!=null&&A+1>=window.PROTO.holdAt;)await Fi(100);if(la(d.id,T,T==="yes"?"\u2713":T==="no"?"\u2715":"?"),A++,f===!0&&(c++,e.kind==="UPDATE")){if(d.id===i){ki(),Jh(),vl(d.id,`<div class="rc-h">\u0441\u0442\u0440\u043E\u043A\u0430 ${d.id}</div><div class="rc-v err">${sn(r.constraint||"\u043E\u0442\u043A\u0430\u0437")}</div><div class="rc-t">${sn(Qh(r))}</div>`,"err"),mi.err(),fn("jump",!0),kv(),ua(A,c,a),st("result").innerHTML=`<span class="bad">ERROR: ${sn(r.message)}</span><div class="ru">\u041A\u043E\u043C\u0430\u043D\u0434\u0430 \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430. \u0412\u0441\u0451, \u0447\u0442\u043E \u0431\u044B\u043B\u043E \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u0434\u043E \u044D\u0442\u043E\u0439 \u0441\u0442\u0440\u043E\u043A\u0438, \u043E\u0442\u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F.</div>`,await Fi(1600),st("rewind").hidden=!1,mi.rew(),aa("\u041E\u0422\u041A\u0410\u0422","\u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u0446\u0435\u043B\u0438\u043A\u043E\u043C \u043E\u0442\u043C\u0435\u043D\u0435\u043D\u0430");for(let R of l.reverse()){let E=zs[R];E&&(await Os(E.scale,{x:.01,y:.01,z:.01},120,"io"),xl(R,null)),Il(R)}await Fi(400),st("rewind").hidden=!0,Ml(),ki(),fn("idle"),_l(!1,"\u041E\u0442\u043A\u0430\u0437 \u0421\u0423\u0411\u0414: \u043D\u0438 \u043E\u0434\u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0430 \u043D\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0430 \u2014 \u0434\u0430\u0436\u0435 \u0442\u0435, \u0447\u0442\u043E \u0448\u043B\u0438 \u0434\u043E \u043E\u0448\u0438\u0431\u043A\u0438.");return}let M=e.sets.find(R=>R.col==="meal");M&&(xl(d.id,d.v0===void 0?null:d["v"+e.sets.indexOf(M)],!0),mi.pop()),l.push(d.id),m||(fn("jump",!0),dd(d.id),await Fi(Math.max(60,300/Ns)),fn("idle"))}ua(A,c,a),m||ki()}Jh(),Object.entries(Pr).forEach(([d,p])=>{p.inner.classList.contains("no")&&p.inner.animate([{opacity:1},{opacity:0}],{duration:600,fill:"forwards"})}),await Yh(Tn+1.2,500),Pt.userData.face=-Math.PI/2;let u=await rn.query(e.sql),h=e.kind==="UPDATE"?`UPDATE ${u.affectedRows}`:`(${u.rows.length} \u0441\u0442\u0440\u043E\u043A)`;st("result").innerHTML=`<span class="ok">${h}</span>${e.kind==="SELECT"?'<div class="ru">\u042D\u0442\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440: \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u043E\u0441\u044C. \u041C\u0435\u0442\u043A\u0438 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442, \u043A\u043E\u0433\u043E \u0437\u0430\u0434\u0435\u043B\u0430 \u0431\u044B \u043A\u043E\u043C\u0430\u043D\u0434\u0430 \u0441 \u0442\u0435\u043C \u0436\u0435 WHERE.</div>':""}`,aa(h,e.kind==="UPDATE"?"\u0438\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E":"\u043F\u0440\u0438\u0446\u0435\u043B \u2014 \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439"),e.kind==="UPDATE"&&await Zv()}finally{Gh(null),Yn=!1,st("runBtn").disabled=!1}}function Qh(s){let e=s.code;return e==="23514"?`\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043D\u0435 \u043F\u0440\u043E\u0445\u043E\u0434\u0438\u0442 \u043F\u0440\u0430\u0432\u0438\u043B\u043E ${s.constraint||""}: meal \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E '\u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442', '\u0434\u0435\u0442\u0441\u043A\u043E\u0435', '\u0432\u0435\u0433\u0435\u0442\u0430\u0440\u0438\u0430\u043D\u0441\u043A\u043E\u0435' \u0438\u043B\u0438 '\u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D'.`:e==="42703"?"\u0422\u0430\u043A\u043E\u0433\u043E \u0441\u0442\u043E\u043B\u0431\u0446\u0430 \u043D\u0435\u0442. \u0421\u0442\u043E\u043B\u0431\u0446\u044B: "+br.join(", ")+".":e==="42601"?"\u0421\u0438\u043D\u0442\u0430\u043A\u0441\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u043B\u043E\u0432\u043E, \u043D\u0430\u0437\u0432\u0430\u043D\u043D\u043E\u0435 \u0432 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0438, \u0438 \u0447\u0442\u043E \u043F\u0435\u0440\u0435\u0434 \u043D\u0438\u043C.":e==="22P02"||e==="42883"?"\u0422\u0438\u043F\u044B \u043D\u0435 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F: \u0442\u0435\u043A\u0441\u0442 \u043F\u0438\u0448\u0435\u0442\u0441\u044F \u0432 \u043E\u0434\u0438\u043D\u0430\u0440\u043D\u044B\u0445 \u043A\u0430\u0432\u044B\u0447\u043A\u0430\u0445, \u0447\u0438\u0441\u043B\u0430 \u2014 \u0431\u0435\u0437.":""}async function Zv(){let s=(await rn.query("SELECT id, birth_year, meal FROM passenger ORDER BY id")).rows,e=0,t=0,n=0;if(s.forEach(i=>{let r=i.birth_year!==null&&i.birth_year>=2012?"\u0434\u0435\u0442\u0441\u043A\u043E\u0435":null;r!==i.meal&&(r&&!i.meal?(t++,la(i.id,"miss","\u0410 \u043C\u043D\u0435?")):!r&&i.meal?(e++,la(i.id,"extra","\u041C\u043D\u0435?!")):(n++,la(i.id,"extra","\u043D\u0435 \u0442\u043E")))}),!e&&!t&&!n){mi.ok(),fn("jump",!0);let i=s.filter(r=>r.meal).map(r=>r.id);for(let r of i)dd(r,.45),await Fi(90);Hv(),_l(!0,`\u0412\u0441\u0435 ${i.length} \u0434\u0435\u0442\u0435\u0439 \u0441 \u043F\u043E\u0434\u043D\u043E\u0441\u0430\u043C\u0438, \u0432\u0437\u0440\u043E\u0441\u043B\u044B\u0445 \u043D\u0435 \u0437\u0430\u0434\u0435\u043B\u0438. \u0410 \u0443 \u0440\u0435\u0431\u0451\u043D\u043A\u0430 \u0431\u0435\u0437 \u0433\u043E\u0434\u0430 \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u2014 NULL: \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435 \u0441 \u043D\u0438\u043C \u0434\u0430\u0451\u0442 \xAB\u043D\u0435 \u0437\u043D\u0430\u044E\xBB, \u0438 \u0441\u0442\u0440\u043E\u043A\u0430 \u043D\u0435 \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442.`)}else mi.err(),_l(!1,[e?`\u0417\u0430\u0434\u0435\u043B\u0438 \u043B\u0438\u0448\u043D\u0438\u0445: ${e}`:"",t?`\u041D\u0435 \u0434\u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C: ${t}`:"",n?`\u041D\u0435 \u0442\u043E \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: ${n}`:""].filter(Boolean).join(" \xB7 ")+". \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u0421\u0431\u0440\u043E\u0441\xBB \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043D\u043E\u0432\u0430.")}function _l(s,e){document.querySelectorAll("#mission li").forEach(t=>t.classList.toggle("done",s)),st("verdict").innerHTML=`<div class="${s?"v-ok":"v-bad"}"><b>${s?"\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E":"\u041D\u0435 \u0441\u043E\u0432\u043F\u0430\u043B\u043E"}</b>${sn(e)}</div>`}function Fv(s){let e=new b(Pt.position.x,1.25,0),t=s.position.clone();t.y=1*s.userData.s+s.position.y;let n=t.clone().sub(e),i=n.length();Ls.scale.set(1,i,1),Ls.position.copy(e).add(n.multiplyScalar(.5)),Ls.quaternion.setFromUnitVectors(new b(0,-1,0),t.clone().sub(e).normalize()),Ls.material.opacity=.28}function Jh(){Ls.material.opacity=0}var ha=0;function kv(){ha=performance.now()}function Vv(){fn("jump",!0),setTimeout(()=>fn("idle"),700)}var Tl=[];function Hv(){let s=[16761370,3108723,11883067,3886458,16777215];for(let e=0;e<160;e++){let t=new At(new Ni(.12,.07),new Gt({color:s[e%s.length],side:Bt}));t.position.set(vi+(Math.random()-.5)*Jn,4+Math.random()*2,(Math.random()-.5)*5),t.userData.v=new b((Math.random()-.5)*.8,-1.2-Math.random(),(Math.random()-.5)*.8),t.userData.r=new b(Math.random()*6,Math.random()*6,0),Ye.add(t),Tl.push(t)}setTimeout(()=>Tl.splice(0).forEach(e=>Ye.remove(e)),4500)}function Pl(){let s=st("stage").clientWidth,e=st("stage").clientHeight;on.setSize(s,e),pa.setSize(s,e);let t=s/e,n=6.8/Qe.curZoom;_n.left=-n*t,_n.right=n*t,_n.top=n,_n.bottom=-n,_n.updateProjectionMatrix()}window.addEventListener("resize",Pl);var yn=null;on.domElement.addEventListener("pointerdown",s=>{yn={x:s.clientX,y:s.clientY,tx:Qe.tx,tz:Qe.tz,m:!1}});window.addEventListener("pointermove",s=>{if(!yn)return;let e=s.clientX-yn.x,t=s.clientY-yn.y;Math.abs(e)+Math.abs(t)>4&&(yn.m=!0);let n=.018/Qe.curZoom;Qe.tx=yn.tx-(e*.7+t*.9)*n,Qe.tz=yn.tz+(e*.7-t*.9)*n,Qe.follow=!1});window.addEventListener("pointerup",s=>{yn&&!yn.m&&jv(s),yn=null});on.domElement.addEventListener("wheel",s=>{s.preventDefault(),Qe.zoom=Math.max(.6,Math.min(2.6,Qe.zoom*Math.pow(1.0015,-s.deltaY)))},{passive:!1});var qh=new Qo;function jv(s){let e=on.domElement.getBoundingClientRect();qh.setFromCamera(new re((s.clientX-e.left)/e.width*2-1,-(s.clientY-e.top)/e.height*2+1),_n);let t=qh.intersectObjects(Object.values(Gn),!0).find(i=>i.object.userData.pid);if(!t||Yn){Yn||ki();return}let n=t.object.userData.pid;rn.query("SELECT * FROM passenger WHERE id = $1",[n]).then(i=>{let r=i.rows[0];vl(n,`<div class="rc-h">passenger \xB7 \u0441\u0442\u0440\u043E\u043A\u0430 ${n}</div>${br.map(o=>`<div><span>${o}</span><b>${sn(fd(r[o]))}</b></div>`).join("")}`,"info")})}var Xv=new Yo;function pd(){let s=Math.min(.05,Xv.getDelta()),e=performance.now();for(let a=Aa.length-1;a>=0;a--){let A=Aa[a],c=Math.min(1,(e-A.t0)/A.ms),l=zv[A.ease](c);for(let u in A.to)A.o[u]=A.from[u]+(A.to[u]-A.from[u])*l;c>=1&&(Aa.splice(a,1),A.res())}da&&da.update(s);let n=(Pt.userData.face??-Math.PI/2)-Pt.rotation.y;for(;n>Math.PI;)n-=2*Math.PI;for(;n<-Math.PI;)n+=2*Math.PI;Pt.rotation.y+=n*Math.min(1,s*10),Yn&&Qe.follow!==!1&&(Qe.tx+=(Pt.position.x+1.2-Qe.tx)*Math.min(1,s*2.5),Qe.tz+=(0-Qe.tz)*s*2),Qe.cx+=(Qe.tx-Qe.cx)*Math.min(1,s*4),Qe.cz+=(Qe.tz-Qe.cz)*Math.min(1,s*4);let i=Yn&&Qe.follow!==!1?Math.max(Qe.zoom,1.45):Qe.zoom;Qe.curZoom+=(i-Qe.curZoom)*Math.min(1,s*3);let r=ha&&e-ha<500?(1-(e-ha)/500)*.12:0,o=new b(Qe.cx+(Math.random()-.5)*r,0,Qe.cz+(Math.random()-.5)*r);_n.position.copy(o).add(_v.clone().multiplyScalar(40)),_n.lookAt(o),Pl(),Tl.forEach(a=>{a.position.addScaledVector(a.userData.v,s*2),a.rotation.x+=a.userData.r.x*s,a.rotation.y+=a.userData.r.y*s}),on.render(Ye,_n),pa.render(Ye,_n),requestAnimationFrame(pd)}async function Gv(){for(Pl(),pd(),await Rv();!window.__pg;)await Fi(30);rn=await window.__pg,await wl(),st("loading").hidden=!0,st("runBtn").onclick=()=>{Qe.follow=!0,yl()},st("sql").addEventListener("keydown",s=>{s.key==="Enter"&&(s.ctrlKey||s.metaKey)&&(s.preventDefault(),Qe.follow=!0,yl())}),st("resetBtn").onclick=()=>{Yn||wl()},document.querySelectorAll("[data-spd]").forEach(s=>s.onclick=()=>{Ns=+s.dataset.spd,document.querySelectorAll("[data-spd]").forEach(e=>e.classList.toggle("on",e===s))}),st("sndBtn").onclick=()=>{ca=!ca,st("sndBtn").classList.toggle("off",ca)},st("homeBtn").onclick=()=>{Qe.tx=2.6,Qe.tz=0,Qe.zoom=1,Qe.follow=!0},st("sql").focus()}window.PROTO={holdAt:null,run:yl,get running(){return Yn},set speed(s){Ns=s},reset:()=>wl(),get db(){return rn}};Gv();})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
