(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();Promise.create=function(){const s=new Promise((r,a)=>{this.temp_resolve=r,this.temp_reject=a});return s.resolve=this.temp_resolve,s.reject=this.temp_reject,delete this.temp_resolve,delete this.temp_reject,s};var B=null;let Bt=async s=>(B=await(await navigator.gpu?.requestAdapter())?.requestDevice(),B||(console.log("error finding device"),null)),Ze=async s=>await(await fetch(s)).text(),et=async s=>{const r=await Ze(s),a=B.createShaderModule({label:`${s} module`,code:r});return{pipeline:B.createComputePipeline({label:`${s} pipeline`,layout:"auto",compute:{module:a,entryPoint:"main"}})}};class tt{constructor(){this.label=null,this.passDescriptor=null,this.pipeline=null,this.bindGroup=null,this.uniformsData=null,this.uniformsBuffer=null}setBindGroup=r=>{this.bindGroup=B.createBindGroup({label:`${this.label} bind group`,layout:this.pipeline.getBindGroupLayout(0),entries:r})}}async function J(s,r,a=1,i=[{format:navigator.gpu.getPreferredCanvasFormat()}],e=!0,t="none"){let o=new tt;const n=await Ze(r),c=B.createShaderModule({label:`${s} module`,code:n}),l={label:`${s} pipeline`,layout:"auto",vertex:{module:c,entryPoint:"vs"},fragment:{module:c,entryPoint:"fs",targets:i},primitive:{topology:"triangle-list",cullMode:t},multisample:{count:a}},g=i.map(De=>({clearView:[1,1,1,1],storeOp:"store",loadOp:"clear"})),U={label:`${s} rendering pass descriptor`,colorAttachments:g};e&&(l.depthStencil={depthWriteEnabled:!0,depthCompare:"less",format:"depth32float"},U.depthStencilAttachment={depthClearValue:1,depthStoreOp:"store",depthLoadOp:"clear"});const I=B.createRenderPipeline(l);return o.label=s,o.pipeline=I,o.passDescriptor=U,o}async function fe(s,r,a=null,i=null){let e=new tt,t=Promise.create();if(et(r).then(o=>{e.pipeline=o.pipeline,t.resolve()}),await t,e.label=s,a&&(e.uniformsData=new Float32Array(a),e.uniformsBuffer=B.createBuffer({label:`${s} uniforms buffer`,size:e.uniformsData.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),B.queue.writeBuffer(e.uniformsBuffer,0,e.uniformsData)),i){let o=i.map((n,c)=>({binding:c,resource:{buffer:n=="uniforms"?e.uniformsBuffer:n}}));e.bindGroup=B.createBindGroup({label:`${s} bind group`,layout:e.pipeline.getBindGroupLayout(0),entries:o})}return e}async function Ut(s){let r,a=Promise.create();return fetch(s).then(i=>{i.json().then(e=>{r=e,a.resolve()})}),await a,r}async function Dt(s,r){let a=await Ut(r),i={},e={};for(let n in a){const c=new Float32Array(a[n]);let l=c;if(n=="position"||n=="normal"){l=[];for(let g=0;g<c.length;g+=3)l.push(c[g+0]),l.push(c[g+1]),l.push(c[g+2]),l.push(1);e.length=l.length/4,l=new Float32Array(l)}i[n]=l}let t=0;for(let n=0;n<i.uv.length;n+=2)i.position[t+3]=i.uv[n+0],i.normal[t+3]=i.uv[n+1],t+=4;let o={position:"",normal:""};for(let n in o)e[n]=B.createBuffer({label:`${s} ${n} buffer`,size:i[n].byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),B.queue.writeBuffer(e[n],0,i[n]);return e}async function Tt(s){const a=await(await fetch(s)).blob();return await createImageBitmap(a,{colorSpaceConversion:"none"})}async function Gt(s){const r=await Tt(s),a=B.createTexture({label:s,format:"rgba8unorm",size:[r.width,r.height],usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});return B.queue.copyExternalImageToTexture({source:r,flipY:!0},{texture:a},{width:r.width,height:r.height}),a}Promise.create();let Xe=!1,Te,Ge;async function Mt(s,r){if(!Xe){let t=Promise.create();et("../mipmaps/MipMapCompute.wgsl").then(o=>{Te=o.pipeline,t.resolve()}),await t,Ge=[];for(let o=0;o<s.mipLevelCount-1;o++){const n=r.createBindGroup({label:"bind group for mipmap",layout:Te.getBindGroupLayout(0),entries:[{binding:0,resource:s.createView({baseMipLevel:o,mipLevelCount:1})},{binding:1,resource:s.createView({baseMipLevel:o+1,mipLevelCount:1})}]});Ge.push(n)}Xe=!0}const a=r.createCommandEncoder({label:"encoder"}),i=a.beginComputePass({label:"mipmap pass"});i.setPipeline(Te);for(let t=0;t<s.mipLevelCount-1;t++){let o=Math.pow(2,s.mipLevelCount-t-2);i.setBindGroup(0,Ge[t]),i.dispatchWorkgroups(o,o,o)}i.end();const e=a.finish();r.queue.submit([e])}class yt{constructor(r){this.block=!1,this.position=vec3.create(),this.down=!1,this.prevMouseX=0,this.prevMouseY=0,this.currentMouseX=0,this.currentMouseY=0,this.alpha=Math.PI*.5,this.beta=0,this._alpha=this.alpha,this._beta=this.beta,this.ratio=1,this.init=!0,this.target=[.5,.35,.25],this._alpha2=this.alpha,this._beta2=this.beta,this.gaze=!0,this.ratio=1,this.init=!0,this.lerp=.1,this.lerp2=.1,this.perspectiveMatrix=mat4.create(),this.cameraTransformMatrix=mat4.create(),this.orientationMatrix=mat4.create(),this.transformMatrix=mat4.create(),r.style.cursor="-moz-grab",r.style.cursor=" -webkit-grab",document.addEventListener("mousemove",a=>{this.currentMouseX=a.clientX,this.currentMouseY=a.clientY},!1),document.addEventListener("mousedown",a=>{r.style.cursor="-moz-grabbing",r.style.cursor=" -webkit-grabbing",this.down=!0},!1),document.addEventListener("mouseup",a=>{r.style.cursor="-moz-grab",r.style.cursor=" -webkit-grab",this.down=!1},!1)}updateCamera(r,a,i){if(this.ratio=i,mat4.perspective(this.perspectiveMatrix,r*Math.PI/180,a,.01,1e3),this.block||(this.down&&(this.alpha-=.1*(this.currentMouseY-this.prevMouseY)*Math.PI/180,this.beta+=.1*(this.currentMouseX-this.prevMouseX)*Math.PI/180),this.gaze&&!this.down&&(this.alpha=Math.PI/2-3*(this.currentMouseY-this.prevMouseY)*Math.PI/180,this.beta=3*(this.currentMouseX-this.prevMouseX)*Math.PI/180),this.alpha<=.45*Math.PI&&(this.alpha=.45*Math.PI),this.alpha>=.51*Math.PI&&(this.alpha=.51*Math.PI),this.beta<=-.3*Math.PI&&(this.beta=-.3*Math.PI),this.beta>=.3*Math.PI&&(this.beta=.3*Math.PI)),this.lerp=this.down?.2:.05,this.lerp2+=(this.lerp-this.lerp2)*.1,this._alpha!=this.alpha||this._beta!=this.beta||this.init){this._alpha+=(this.alpha-this._alpha)*this.lerp2,this._beta+=(this.beta-this._beta)*this.lerp2,this._alpha2+=(this._alpha-this._alpha2)*this.lerp2,this._beta2+=(this._beta-this._beta2)*this.lerp2,this.position[0]=this.ratio*Math.sin(this._alpha2)*Math.sin(this._beta2)+this.target[0],this.position[1]=this.ratio*Math.cos(this._alpha2)+this.target[1],this.position[2]=this.ratio*Math.sin(this._alpha2)*Math.cos(this._beta2)+this.target[2],this.cameraTransformMatrix=this.defineTransformMatrix(this.position,this.target,[0,1,0]);for(let e=0;e<16;e++)this.orientationMatrix[e]=this.cameraTransformMatrix[e];this.orientationMatrix[12]=0,this.orientationMatrix[13]=0,this.orientationMatrix[14]=0,mat4.transpose(this.orientationMatrix,this.orientationMatrix)}this.prevMouseX=this.currentMouseX,this.prevMouseY=this.currentMouseY,mat4.multiply(this.transformMatrix,this.perspectiveMatrix,this.cameraTransformMatrix)}calculateReflection(r,a){let i=vec3.fromValues(r[0],r[1],r[2]);vec3.sub(i,i,this.position);let e=vec3.create();vec3.scale(e,a,2*vec3.dot(i,a)),vec3.sub(i,i,e),vec3.negate(i,i),vec3.add(i,i,r);let t=vec3.fromValues(r[0],r[1],r[2]);vec3.sub(t,t,this.target),vec3.scale(e,a,2*vec3.dot(t,a)),vec3.sub(t,t,e),vec3.negate(t,t),vec3.add(t,t,r);let o=vec3.fromValues(0,-1,0);this.reflectionPosition=i,this.cameraReflectionMatrix=this.defineTransformMatrix2(i,t,o)}defineTransformMatrix(r,a,i){let e=mat4.create(),t=vec3.create(),o=vec3.create(),n=vec3.create(),c=vec3.create(),l=vec3.create();l[0]=i[0],l[1]=i[1],l[2]=i[2],vec3.subtract(t,r,a),vec3.normalize(o,t);let g=vec3.dot(o,l),U=vec3.create();return vec3.scale(U,o,g),vec3.subtract(n,l,U),vec3.normalize(n,n),vec3.cross(c,o,n),e[0]=c[0],e[1]=n[0],e[2]=o[0],e[3]=0,e[4]=c[1],e[5]=n[1],e[6]=o[1],e[7]=0,e[8]=c[2],e[9]=n[2],e[10]=o[2],e[11]=0,e[12]=-vec3.dot(r,c),e[13]=-vec3.dot(r,n),e[14]=-vec3.dot(r,o),e[15]=1,e}defineTransformMatrix2(r,a,i){let e=mat4.create(),t=vec3.create(),o=vec3.create(),n=vec3.create(),c=vec3.create(),l=vec3.create();l[0]=i[0],l[1]=i[1],l[2]=i[2],vec3.subtract(t,r,a),vec3.normalize(o,t);let g=vec3.dot(o,l),U=vec3.create();return vec3.scale(U,o,g),vec3.subtract(n,l,U),vec3.normalize(n,n),vec3.cross(c,n,o),e[0]=c[0],e[1]=n[0],e[2]=o[0],e[3]=0,e[4]=c[1],e[5]=n[1],e[6]=o[1],e[7]=0,e[8]=c[2],e[9]=n[2],e[10]=o[2],e[11]=0,e[12]=-vec3.dot(r,c),e[13]=-vec3.dot(r,n),e[14]=-vec3.dot(r,o),e[15]=1,e}}let xt=1.8,oe=3,A=null,h=null,E=null,Me,rt,ye=0,We=0;const Ie=30;let Oe,H,te,ve,K,ze,Be,me,Ve,Ue,Q,b,W,w,C,re,P,R,_,O,Y,Z,$e,k,T=vec3.create(),be=vec3.create(),we=vec3.create(),z=vec3.create(),ke=0,Fe=Promise.create();function Ct(s){H=h.createBuffer({label:"position buffer",size:E,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),Oe=h.createBuffer({label:"init position buffer",size:E,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),h.queue.writeBuffer(H,0,s),h.queue.writeBuffer(Oe,0,s),te=h.createBuffer({label:"position buffer 1",size:E,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),ve=h.createBuffer({label:"position buffer 2",size:E,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),K=h.createBuffer({label:"velocity buffer 1",size:E,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),Q=h.createBuffer({label:"color buffer",size:E,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),Be=h.createBuffer({label:"indices buffer data",size:Math.pow(A,3)*4*Ie,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),ze=h.createBuffer({label:"counterBuffer buffer",size:Math.pow(A,3)*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),me=h.createBuffer({label:"raytracing buffer data",size:Math.pow(A,3)*4*20,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),Ve=h.createBuffer({label:"counter raytracing buffer",size:Math.pow(A,3)*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});function r(a){a=Number("0x".concat(a)),a=Math.floor(a);let i=(a>>16&255)/255,e=(a>>8&255)/255,t=(a&255)/255;return[i,e,t,1]}P=[],P.push(r("fc8c03")),P.push(r("ffffff")),P.push(r("fc8c03")),P.push(r("fc8c03")),P.push(r("fc8c03")),P=P.flat(),P=new Float32Array(P),R=[],R.push(r("03dffc")),R.push(r("03dffc")),R.push(r("03dffc")),R.push(r("ffffff")),R.push(r("03dffc")),R=R.flat(),R=new Float32Array(R),_=[],_.push(r("d47dff")),_.push(r("ffffff")),_.push(r("d47dff")),_.push(r("d47dff")),_.push(r("d47dff")),_=_.flat(),_=new Float32Array(_),O=[],O.push(r("f58eaf")),O.push(r("f58eaf")),O.push(r("ffffff")),O.push(r("f58eaf")),O.push(r("f58eaf")),O=O.flat(),O=new Float32Array(O),Y=[],Z=0,Y.push(P),Y.push(R),Y.push(_),Y.push(O),Ue=h.createBuffer({label:"palette buffer",size:P.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),h.queue.writeBuffer(Ue,0,P)}async function Rt(s,r,a,i,e){A=s,rt=r.length/4,Me=new Float32Array(r),E=Me.byteLength,h=i,k=e,re=a,Ct(Me),b=await fe("forces","../simulation/PBF_applyForces.wgsl",new Array(40).fill(0),[Oe,te,K,ze,Be,Ve,me,"uniforms"]),W=await fe("displacement","../simulation/PBF_calculateDisplacements.wgsl",[A,xt,0,0,Ie,0,0,0],[te,ve,Be,"uniforms"]),w=await fe("velocity","../simulation/PBF_integrateVelocity.wgsl",new Array(40).fill(0)),w.setBindGroup([{binding:0,resource:{buffer:H}},{binding:1,resource:{buffer:ve}},{binding:2,resource:{buffer:K}},{binding:3,resource:{buffer:w.uniformsBuffer}},{binding:4,resource:re.createView({baseMipLevel:0,mipLevelCount:1})},{binding:5,resource:{buffer:Ue}},{binding:6,resource:{buffer:Q}}]),C=await fe("fill texture","../tests/HalfTextureFill.wgsl",[0,0,0,0]),C.setBindGroup([{binding:0,resource:re.createView({baseMipLevel:0,mipLevelCount:1})},{binding:1,resource:{buffer:C.uniformsBuffer}}]),document.addEventListener("mousemove",Ot),document.addEventListener("mousedown",_t),Fe.resolve()}function _t(s){s.clientX,s.clientY}function Ot(s){let r=2*s.clientX/window.innerWidth-1,a=1-2*s.clientY/window.innerHeight,i=vec3.fromValues(r,a,0),e=vec3.fromValues(r,a,1),t=mat4.create(),o=mat4.create();mat4.invert(t,k.cameraTransformMatrix),mat4.invert(o,k.perspectiveMatrix);let n=mat4.create();mat4.multiply(n,t,o),vec3.transformMat4(i,i,n),vec3.transformMat4(e,e,n),vec3.scale(i,i,A),vec3.scale(e,e,A);let c=vec3.create();vec3.sub(c,e,i),vec3.normalize(c,c);let l=vec3.fromValues(0,0,-1),g=vec3.fromValues(0,0,.35*A);vec3.transformMat4(l,l,k.orientationMatrix),vec3.transformMat4(g,g,k.orientationMatrix);let U=0;const I=vec3.dot(c,l);I>1e-4&&(vec3.sub(g,g,i),U=vec3.dot(g,l)/I),vec3.scale(c,c,U),vec3.add(i,i,c),T[0]=i[0],T[1]=i[1],T[2]=i[2]}async function At(s={x:0,y:-10,z:0},r=.01,a,i,e,t,o,n,c,l){await Fe;function g(d){const ge=S.beginComputePass({label:d.label});ge.setPipeline(d.pipeline),ge.setBindGroup(0,d.bindGroup),ge.dispatchWorkgroups(rt/256),ge.end()}let U=We%1e3;if(U===0){let d=Z;for(;d==Z;)d=Math.floor(Math.random()*Y.length);$e=Z,Z=d}let I=U/1e3;I=Math.pow(I,.4);let De=new Float32Array(P.length);for(let d=0;d<P.length;d++)De[d]=Y[Z][d]*I+Y[$e][d]*(1-I);We++,h.queue.writeBuffer(Ue,0,De),vec3.sub(we,T,be),z[0]+=(we[0]-z[0])*.1,z[1]+=(we[1]-z[1])*.1,z[2]+=(we[2]-z[2])*.1;for(let d=0;d<16;d++)b.uniformsData[d]=k.orientationMatrix[d];b.uniformsData[16]=s.x,b.uniformsData[17]=s.y,b.uniformsData[18]=s.z,b.uniformsData[19]=r,b.uniformsData[20]=T[0],b.uniformsData[21]=T[1],b.uniformsData[22]=T[2],b.uniformsData[23]=A,b.uniformsData[24]=z[0],b.uniformsData[25]=z[1],b.uniformsData[26]=z[2],b.uniformsData[27]=ye,b.uniformsData[28]=e?8:0,b.uniformsData[29]=ke,b.uniformsData[30]=Ie,ye+=1,be[0]=T[0],be[1]=T[1],be[2]=T[2],h.queue.writeBuffer(b.uniformsBuffer,0,b.uniformsData);for(let d=0;d<16;d++)w.uniformsData[d]=k.orientationMatrix[d];w.uniformsData[16]=T[0],w.uniformsData[17]=T[1],w.uniformsData[18]=T[2],w.uniformsData[19]=r,w.uniformsData[20]=A,w.uniformsData[21]=a,w.uniformsData[22]=4,w.uniformsData[23]=t,w.uniformsData[24]=ke,w.uniformsData[25]=n,h.queue.writeBuffer(w.uniformsBuffer,0,w.uniformsData),W.uniformsData[2]=i,W.uniformsData[3]=ye,W.uniformsData[5]=l,h.queue.writeBuffer(W.uniformsBuffer,0,W.uniformsData);const S=h.createCommandEncoder({label:"encoder"});S.copyBufferToBuffer(H,0,te,0,E),S.clearBuffer(ze),S.clearBuffer(Be),S.clearBuffer(me),S.clearBuffer(Ve),C.uniformsData[0]=a,C.uniformsData[1]=o,C.uniformsData[2]=c,C.uniformsData[3]=l,h.queue.writeBuffer(C.uniformsBuffer,0,C.uniformsData);const he=S.beginComputePass({label:C.label});if(he.setPipeline(C.pipeline),he.setBindGroup(0,C.bindGroup),he.dispatchWorkgroups(re.width,re.width,re.width),he.end(),g(b),oe=5,e)switch(oe=3,gpuTier.tier){case 3:oe=5;break;case 2:oe=4;break}for(let d=0;d<oe;d++)g(W),S.copyBufferToBuffer(ve,0,te,0,E);g(w),S.copyBufferToBuffer(te,0,H,0,E);const vt=S.finish();h.queue.submit([vt])}const p=await Bt(),ie=document.querySelector("canvas");ie.width=window.innerWidth;ie.height=window.innerHeight;const at=ie.getContext("webgpu"),St=navigator.gpu.getPreferredCanvasFormat();at.configure({device:p,format:St});let f=new yt(ie),xe=1,Et=35,v=20;function It(){return 1+4*Math.pow(Math.random(),2)}var u={depthTest:1,mixAlpha:1,size:600/v,deltaTime:.01,coneAngle:.94,gridRadius:5,coneRotation:90,particleOcclusion:.63,boxOcclusion:.53,lightIntensity:15,particlesLight:50,ambientLight:0,separation:0,IOR:2,raytrace:!1,vertical:!0,gaze:!1,acceleration:1.3};let it=8,Ce=Math.pow(2,it),N=mat4.create(),Re=1/v,je=mat4.fromValues(Re,0,0,0,0,Re,0,0,0,0,Re,0,0,0,0,1);var st=new dat.GUI,X=st.addFolder("renderer");X.add(u,"raytrace").name("raytrace");X.add(u,"vertical");X.add(u,"gaze").name("camera gaze");X.add(u,"lightIntensity",0,100,1).name("light intensity").step(1);X.add(u,"particlesLight",0,150,1).name("particles light").step(1);X.add(u,"ambientLight",0,10,1).name("ambient light").step(.05);X.add(u,"IOR",1,10,1).name("IOR").step(.001);X.add(u,"particleOcclusion",0,1,1).name("occlusion").step(.001);var ot=st.addFolder("simulation");ot.add(u,"deltaTime",.001,.02,0).name("delta time").step(.001);ot.add(u,"acceleration",0,10,0).name("acceleration").step(1);const Ne=p.createTexture({size:[Ce,Ce,Ce],format:"rgba16float",dimension:"3d",mipLevelCount:it+1,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.COPY_DST});let nt=new Array(72).fill(0),D=new Float32Array(nt),G=new Float32Array(nt);const ut=p.createBuffer({label:"uniforms cube buffer",size:D.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),ct=p.createBuffer({label:"uniforms cube buffer",size:D.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let lt=new Array(16*5).fill(0),m=new Float32Array(lt),pe=new Float32Array(lt);const ft=p.createBuffer({label:"uniforms geometry buffer",size:m.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),pt=p.createBuffer({label:"uniforms geometry buffer",size:pe.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),F=new Float32Array([0,1,0,0]),Ke=p.createBuffer({label:"uniforms post pro buffer",size:F.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),ne=new Float32Array([0,1,0,0]),Je=p.createBuffer({label:"uniforms post pro buffer",size:F.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});p.createBuffer({label:"uniforms post pro buffer",size:F.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});p.createBuffer({label:"uniforms post pro buffer",size:F.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const L=new Float32Array([v,0,0,0,0,0,0,0]),dt=p.createBuffer({label:"uniforms shade buffer",size:L.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let zt=new Array(72).fill(0),Vt=new Float32Array(zt);p.createBuffer({label:"uniforms sphere buffer",size:Vt.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let mt=Promise.create(),Le=new Image;Le.onload=()=>{mt.resolve()};Le.src="../assets/logo-circle.png";await mt;let Ye=document.createElement("canvas");Ye.width=1024;Ye.height=1024;let ht=Ye.getContext("2d");ht.drawImage(Le,0,0);let Qe=ht.getImageData(0,0,1024,1024);Qe=Qe.data;const gt=await Gt("../assets/corsica.png");let bt=[];var Ft=v*1,Nt=Math.floor(.45*Ft),Pe=0,_e=.1;for(let s=.13*v;s<=9*v/16;s++)for(let r=.03*v;r<.97*v;r++)for(let a=.15*v;a<=Nt;a++)bt.push(r+Math.random()*_e,s+Math.random()*_e,a+Math.random()*_e,It()+Math.random()),Pe++;Rt(v,bt,Ne,p,f);await Fe;const qe=H;let j,q,ee,Ae,Se,$,de;function wt(){j!=null&&(j.destroy(),q.destroy()),j=p.createTexture({size:[window.innerWidth,window.innerHeight],sampleCount:4,format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),q=p.createTexture({size:[window.innerWidth,window.innerHeight],sampleCount:4,format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),ee=p.createTexture({size:[window.innerWidth,window.innerHeight],sampleCount:1,format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),Ae=p.createTexture({size:[window.innerWidth,window.innerHeight],sampleCount:1,format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),Se=p.createTexture({size:[window.innerWidth,window.innerHeight],sampleCount:1,format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),de=p.createTexture({size:[window.innerWidth,window.innerHeight],sampleCount:4,format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),$=p.createTexture({size:[window.innerWidth,window.innerHeight],sampleCount:1,format:"rgba8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),q.view=q.createView()}const ae=p.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"});let se=await Dt("cube geometry","assets/box16_9v2_thick.json");const M=await J("render geometry","rendering/RenderGeometry.wgsl",4,[{format:"rgba8unorm"},{format:"rgba8unorm"}],!0,"front"),y=await J("render geometry","rendering/RenderGeometry.wgsl",4,[{format:"rgba8unorm"},{format:"rgba8unorm"}],!0,"none");var He=Ne.createView();M.setBindGroup([{binding:0,resource:{buffer:se.position}},{binding:1,resource:{buffer:se.normal}},{binding:2,resource:{buffer:ft}},{binding:3,resource:He},{binding:4,resource:ae},{binding:5,resource:{buffer:me}},{binding:6,resource:{buffer:H}},{binding:7,resource:{buffer:Q}},{binding:8,resource:{buffer:K}},{binding:9,resource:gt.createView()}]);y.setBindGroup([{binding:0,resource:{buffer:se.position}},{binding:1,resource:{buffer:se.normal}},{binding:2,resource:{buffer:pt}},{binding:3,resource:He},{binding:4,resource:ae},{binding:5,resource:{buffer:me}},{binding:6,resource:{buffer:H}},{binding:7,resource:{buffer:Q}},{binding:8,resource:{buffer:K}},{binding:9,resource:gt.createView()}]);const V=await J("render particles","rendering/RenderParticles.wgsl",4,[{format:"rgba8unorm"},{format:"rgba8unorm"}]),x=await J("render particles","rendering/RenderParticles.wgsl",4,[{format:"rgba8unorm"},{format:"rgba8unorm"}]);V.setBindGroup([{binding:0,resource:{buffer:qe}},{binding:1,resource:{buffer:ut}},{binding:2,resource:{buffer:Q}},{binding:3,resource:{buffer:K}}]);x.setBindGroup([{binding:0,resource:{buffer:qe}},{binding:1,resource:{buffer:ct}},{binding:2,resource:{buffer:Q}},{binding:3,resource:{buffer:K}}]);const ue=await J("post pro","rendering/Postprocessing.wgsl",1,[{format:"rgba8unorm"}],!1),ce=await J("post pro","rendering/Postprocessing.wgsl",1,[{format:"rgba8unorm"}],!1),le=await J("render screen","rendering/RenderToScreen.wgsl",1,[{format:navigator.gpu.getPreferredCanvasFormat()}],!1),Ee=await fe("shade particles","simulation/PBF_shadeParticles.wgsl",new Array().fill(8));Ee.setBindGroup([{binding:0,resource:{buffer:qe}},{binding:1,resource:{buffer:Q}},{binding:2,resource:{buffer:dt}},{binding:3,resource:He},{binding:4,resource:ae}]);window.onresize=wt;wt();function Pt(){let s;if(u.vertical){let e=Math.sin(Math.PI*.5),t=Math.cos(Math.PI*.5);s=mat4.fromValues(t,-e,0,0,e,t,0,0,0,0,1,0,.5,.58,.25,1),f.target=[.5,.6,.25],xe=2.2,u.raytrace?u.boxOcclusion=.25:u.boxOcclusion=.32}else{let e=Math.sin(Math.PI*0),t=Math.cos(Math.PI*0);s=mat4.fromValues(t,-e,0,0,e,t,0,0,0,0,1,0,.5,.357,.25,1),f.target=[.5,.35,.25],xe=1.5,u.raytrace?u.boxOcclusion=.4:u.boxOcclusion=.53}requestAnimationFrame(Pt),At({z:0,y:-u.acceleration,x:0},u.deltaTime,u.lightIntensity,u.separation,u.raytrace,u.particleOcclusion,u.boxOcclusion,u.particlesLight,u.ambientLight,u.vertical),Mt(Ne,p),f.updateCamera(Et,window.innerWidth/window.innerHeight,xe),f.gaze=u.gaze;var r=vec3.fromValues(0,1,0);f.calculateReflection([0,.074,0],r);const a=p.createCommandEncoder({label:"encoder"});{L[0]=f.position[0],L[1]=f.position[1],L[2]=f.position[2],L[3]=v,L[4]=u.coneAngle,L[5]=u.coneRotation,p.queue.writeBuffer(dt,0,L);const e=a.beginComputePass({label:"shade particles pass"});e.setPipeline(Ee.pipeline),e.setBindGroup(0,Ee.bindGroup),e.dispatchWorkgroups(Pe/256),e.end()}{mat4.multiply(N,f.cameraTransformMatrix,je);for(let t=0;t<16;t++)D[t]=N[t];for(let t=0;t<16;t++)D[t+16]=f.perspectiveMatrix[t];for(let t=0;t<16;t++)D[t+32]=f.orientationMatrix[t];D[48]=f.position[0],D[49]=f.position[1],D[50]=f.position[2],D[51]=0,D[52]=window.innerWidth,D[53]=window.innerHeight,D[54]=u.size,D[55]=v,ie.width=window.innerWidth,ie.height=window.innerHeight,p.queue.writeBuffer(ut,0,D),V.passDescriptor.colorAttachments[0].view=q.view,V.passDescriptor.colorAttachments[0].resolveTarget=ee.createView(),V.passDescriptor.colorAttachments[1].view=de.createView(),V.passDescriptor.colorAttachments[1].resolveTarget=$.createView(),V.passDescriptor.depthStencilAttachment.view=j.createView();const e=a.beginRenderPass(V.passDescriptor);e.setPipeline(V.pipeline),e.setBindGroup(0,V.bindGroup),e.draw(6,256*Math.floor(Pe/256)),e.end()}{mat4.multiply(N,f.cameraReflectionMatrix,je);for(let t=0;t<16;t++)G[t]=N[t];for(let t=0;t<16;t++)G[t+16]=f.perspectiveMatrix[t];for(let t=0;t<16;t++)G[t+32]=f.orientationMatrix[t];G[48]=f.position[0],G[49]=f.position[1],G[50]=f.position[2],G[51]=1,G[52]=window.innerWidth,G[53]=window.innerHeight,G[54]=u.size,G[55]=v,p.queue.writeBuffer(ct,0,G),x.passDescriptor.colorAttachments[0].view=q.view,x.passDescriptor.colorAttachments[0].resolveTarget=ee.createView(),x.passDescriptor.colorAttachments[1].view=de.createView(),x.passDescriptor.colorAttachments[1].resolveTarget=$.createView(),x.passDescriptor.depthStencilAttachment.view=j.createView(),x.passDescriptor.colorAttachments[0].loadOp="load",x.passDescriptor.colorAttachments[1].loadOp="load",x.passDescriptor.depthStencilAttachment.depthLoadOp="load";const e=a.beginRenderPass(x.passDescriptor);e.setPipeline(x.pipeline),e.setBindGroup(0,x.bindGroup),e.draw(6,256*Math.floor(Pe/256)),e.end()}{M.passDescriptor.colorAttachments[0].view=q.view,M.passDescriptor.colorAttachments[0].resolveTarget=ee.createView(),M.passDescriptor.depthStencilAttachment.view=j.createView(),M.passDescriptor.colorAttachments[1].view=de.createView(),M.passDescriptor.colorAttachments[1].resolveTarget=$.createView(),M.passDescriptor.colorAttachments[0].loadOp="load",M.passDescriptor.colorAttachments[1].loadOp="load",M.passDescriptor.depthStencilAttachment.depthLoadOp="load",mat4.multiply(N,f.cameraTransformMatrix,s);for(let t=0;t<16;t++)m[t]=N[t];for(let t=0;t<16;t++)m[t+16]=f.perspectiveMatrix[t];for(let t=0;t<16;t++)m[t+32]=s[t];for(let t=0;t<9;t++)m[t+48]=f.orientationMatrix[t];m[60]=u.coneAngle,m[61]=u.coneRotation,m[64]=f.position[0],m[65]=f.position[1],m[66]=f.position[2],m[67]=v,m[68]=u.IOR,m[69]=Number(u.raytrace),m[70]=30,m[71]=0,m[72]=u.vertical,p.queue.writeBuffer(ft,0,m);const e=a.beginRenderPass(M.passDescriptor);e.setPipeline(M.pipeline),e.setBindGroup(0,M.bindGroup),e.draw(se.length),e.end()}{y.passDescriptor.colorAttachments[0].view=q.view,y.passDescriptor.colorAttachments[0].resolveTarget=ee.createView(),y.passDescriptor.depthStencilAttachment.view=j.createView(),y.passDescriptor.colorAttachments[1].view=de.createView(),y.passDescriptor.colorAttachments[1].resolveTarget=$.createView(),y.passDescriptor.colorAttachments[0].loadOp="load",y.passDescriptor.colorAttachments[1].loadOp="load",y.passDescriptor.depthStencilAttachment.depthLoadOp="load",mat4.multiply(N,f.cameraReflectionMatrix,s);for(let t=0;t<m.length;t++)pe[t]=m[t];for(let t=0;t<16;t++)pe[t]=N[t];m[64]=f.position[0],m[65]=f.position[1],m[66]=f.position[2],m[67]=v,pe[71]=1,m[72]=u.vertical,p.queue.writeBuffer(pt,0,pe);const e=a.beginRenderPass(y.passDescriptor);e.setPipeline(y.pipeline),e.setBindGroup(0,y.bindGroup),e.draw(se.length),e.end()}{ue.setBindGroup([{binding:0,resource:ee.createView()},{binding:1,resource:$.createView()},{binding:2,resource:ae},{binding:3,resource:{buffer:Ke}}]),F[0]=0,F[1]=1,F[2]=u.deltaTime,F[3]=1,p.queue.writeBuffer(Ke,0,F),ue.passDescriptor.colorAttachments[0].view=Ae.createView();const e=a.beginRenderPass(ue.passDescriptor);e.setPipeline(ue.pipeline),e.setBindGroup(0,ue.bindGroup),e.draw(6),e.end()}{ce.setBindGroup([{binding:0,resource:Ae.createView()},{binding:1,resource:$.createView()},{binding:2,resource:ae},{binding:3,resource:{buffer:Je}}]),ne[0]=1,ne[1]=0,ne[2]=u.deltaTime,ne[3]=1,p.queue.writeBuffer(Je,0,ne),ce.passDescriptor.colorAttachments[0].view=Se.createView();const e=a.beginRenderPass(ce.passDescriptor);e.setPipeline(ce.pipeline),e.setBindGroup(0,ce.bindGroup),e.draw(6),e.end()}{le.passDescriptor.colorAttachments[0].view=at.getCurrentTexture().createView(),le.setBindGroup([{binding:0,resource:Se.createView()},{binding:1,resource:ae}]);const e=a.beginRenderPass(le.passDescriptor);e.setPipeline(le.pipeline),e.setBindGroup(0,le.bindGroup),e.draw(6),e.end()}const i=a.finish();p.queue.submit([i])}Pt();