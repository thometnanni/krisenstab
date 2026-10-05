//#region src/dither.vert?raw
var e = new OffscreenCanvas(1, 1), t = e.getContext("webgl2"), n = new OffscreenCanvas(1, 1).getContext("2d", { willReadFrequently: !0 }), r, i, a, o, s = /* @__PURE__ */ new Map();
function c(e, n) {
	let r = t.createShader(e);
	if (t.shaderSource(r, n), t.compileShader(r), !t.getShaderParameter(r, t.COMPILE_STATUS)) {
		let e = t.getShaderInfoLog(r);
		throw t.deleteShader(r), Error(e);
	}
	return r;
}
function l() {
	let e = t.createProgram();
	if (t.attachShader(e, c(t.VERTEX_SHADER, "attribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nuniform vec2 u_resolution;\n\nvarying vec2 v_texCoord;\n\nvoid main() {\n   vec2 zeroToOne = a_position / u_resolution;\n   vec2 zeroToTwo = zeroToOne * 2.0;\n   vec2 clipSpace = zeroToTwo - 1.0;\n   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n   v_texCoord = a_texCoord;\n}")), t.attachShader(e, c(t.FRAGMENT_SHADER, "precision mediump float;\n\nuniform sampler2D image;\nuniform sampler2D threshold;\nuniform vec2 resolution;\nuniform vec4 darkColor;\nuniform vec4 lightColor;\n\nvarying vec2 v_texCoord;\n\nvec4 dither(vec2 position, vec4 color) {\n  float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));\n  vec2 uv = mod(position, resolution) / resolution;\n  vec4 limit = texture2D(threshold, uv);\n\n  float dithered = brightness < limit.x ? 0.0 : 1.0;\n  vec4 tone = mix(darkColor, lightColor, dithered);\n\n  float alpha = tone.a * color.a;\n  return vec4(tone.rgb * alpha, alpha);\n}\n\nvoid main() {\n  vec4 color = texture2D(image, v_texCoord);\n  gl_FragColor = dither(gl_FragCoord.xy, color);\n}")), t.linkProgram(e), !t.getProgramParameter(e, t.LINK_STATUS)) {
		let n = t.getProgramInfoLog(e);
		throw t.deleteProgram(e), Error(n);
	}
	return t.useProgram(e), e;
}
function u() {
	let e = t.createTexture();
	return t.bindTexture(t.TEXTURE_2D, e), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST), e;
}
function d(e, n) {
	t.bindTexture(t.TEXTURE_2D, e), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, n);
}
async function f(e) {
	let t = u(), n = await m(e);
	d(t, n), s.set(e, {
		thresholdTexture: t,
		thresholdMap: n
	});
}
async function p() {
	let e = l();
	r = {
		position: t.getAttribLocation(e, "a_position"),
		texcoord: t.getAttribLocation(e, "a_texCoord"),
		resolution: t.getUniformLocation(e, "u_resolution"),
		threshold: t.getUniformLocation(e, "threshold"),
		thresholdSize: t.getUniformLocation(e, "resolution"),
		image: t.getUniformLocation(e, "image"),
		darkColor: t.getUniformLocation(e, "darkColor"),
		lightColor: t.getUniformLocation(e, "lightColor")
	}, a = t.createBuffer(), i = t.createBuffer(), t.bindBuffer(t.ARRAY_BUFFER, i), t.bufferData(t.ARRAY_BUFFER, new Float32Array([
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		1,
		1,
		0,
		1,
		1
	]), t.STATIC_DRAW), o = u(), await f("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAbkklEQVR4nD3bZdhVVRMG4KVY2Ah2t2Jid3diYRd2d7fYYAvYIAaCCioo2I2BYHd3d+f43XNd870/99l7rYknZu1z3rbmmmvGb7/9FmPHjo077rgjlltuuejbt2/stttucfbZZ8fxxx8fq622Whx00EExfvz4mHXWWeONN96Iyy+/PPbZZ5/4888/Y7PNNsv7Pv744+jQoUNstdVW8cUXX8TAgQNjscUWix9//DEOPPDAWGihheKkk06KnXfeOZ5++umYd95547PPPov77rsv/v3333juuefi0ksvjammmiq23XbbOOuss+LXX3+NJ554ImN7//33Y+WVV46ddtopzjjjjBgyZEh069YtRo0aFX369Mm9V1pppbjxxhszzmeffTamnHLKjOfxxx+PiSaaKAYMGJD3W8O6bejQofnwTDPNFKecckom6k9wL774Ymy++ebxyCOPxJ133hnnn39+3HzzzTHFFFPEuuuuG6effnrcfffduZnAl1hiiXjooYfCmmuttVYmIrlNNtkkWmu54XXXXZefXXLJJXHrrbfGvvvum4kKfPfdd8/1Pv/88xg0aFAcccQRMc8888SGG24YE044YXz77bd5/f77749JJpkkfvrpp3jzzTdjzjnnzHjE+fPPP2fxrC++33//Pff54IMPcq+vvvoqpp9++nzuqKOOivb1119nFT101VVXZRctNs0008RNN92UDyjOkksuGT169IhjjjkmA3nsscdihx12yEDeeeedrPp+++0XXbp0yQIee+yxGcRLL70Up512Wmy33XZhL5svs8wy8csvv0SnTp0yuWuvvTb3mHTSSePkk0+ORRZZJNZYY4148MEHM9Bdd901Tj311JhxxhkTJYsvvngcdthhcfHFF8c222wTe++9d3zyyScZG5Ttv//+8e6772ah5QatimRtz3puxRVXjMknnzyajqnMK6+8khDq2rVrdkonXNfZCSaYIN577734+++/Y5VVVsmu6CR4q/iqq64azz//fJx55pmx/fbbx5NPPhnzzz9/rLDCCpno7LPPHsOGDctADj/88Ezs5ZdfTsSNGDEiC/r6669nUUEeCmeZZZb4/vvvE01LL710NgeNtthii/jjjz9ittlmy/vFM3z48Ljiiiuic+fOGQe6aCD02U8T0G6DDTZIJKP7lltumWhqFvKBQHAVb3FGB5dffvl49dVXs/pXX3117LnnnjFy5Mg455xz8rpKX3TRRQmlOeaYI/m8/vrrZ7CC8Pkuu+yS3EUPyNKpPfbYI/fASUUUJASimFjsJUj06927d1IJLe66664499xzY+21104uK6IugjoN2XTTTRNdcoDc7t27x8QTTxw//PBDPPzwwzHddNPlfYccckh89NFH0atXr2g4osv4RmB0Ecx0wGc77rhjbghCzzzzTAZD9CQy7bTTppipJmGxua7ZCC1AWgLXX399PkuQ8H2uueaKG264IQszZsyYWH311WPuuef+f7dd32uvvbKjRx55ZHYQytw733zzxYcffhjHHXdcdhWtFlhggXjqqadSQxTxhBNOyPVQw/7oSWPkds0112ThifzCCy8cDVwl9dZbb0XPnj0zKdXR2QUXXDAeeOCBFJFvvvkmebfsssvmNXxSmNtuuy07ZlFBC0BHx40bl4mhmE4effTR2Yl77rkn+XfhhRdmgQV55ZVXZkElRSzBVFL9+vWLe++9N7uGWrWHPemHz7jWoYceGoMHD85nX3vttXQ1e0ORXNCaVrz99ttJXw2mMdZpYKLqFsPbW265JYXp4IMPTp537NgxH8Q9bqFzEpl55plTnP75558M1saPPvpodpGI2ZDlsUnCR5zYKx7jKWdwHXwhA4JoDMpwH3sQz3XWWScWXXTR7CLNQFN0oieQd8EFF6Q+oR46ozKx1iQFJK6333572jRNGz16dDbpu+++S5o39sDvVVgygmYnLIbAgBVICQKf8M5Cl112WSy11FK5uectttFGG2VXiZ6OUneIoQc0gxNYg5XqCl5yEgLsWQlYCxVphOKLTzNYLfVW6PXWWy8R9tdff8UMM8yQhac7YgZzSj/ZZJMlrTWTaE499dQ5m9AJBeQokNcIlepakNeqLOtQOYMP8VFJHbIhawEj8AJntqfiZSvuxS+I4ipE68svv0yogyU40weWZW3uoEgKSifK/yk8iArSXkQNlXQWxdgvEWO9EEer0EzxaIR1IFRxiTZBVyh6BGUloI1oqTxOCEh3t9566+Sh4HUG3wgQlNgUTVSSJlBcQkRLdItjmC5feOGFhPvGG2+cBdMh05gJDkKIEQ3BX8ImDskQPh1EO2JJ6BRIsGIiZgROkiZBRWXZCqRhBPiAAw7IeMVFx+ylwewcjVANKjlOzgH4AZKESSI4aQDRJROhRIgN6wEdwRJNouMZ9mhBiRieQJEP6yBFRyGJQRF04a7PzRD4CCnGazoDVXQDt8EXQs0GJ554YjaEhRJdMUAe1CgO6oiVBomJ5daUymLNFtDL8Vg2lClsA1kwBEvCVCIH0jbCaYmoOB4LAN/pA+hRXJ3kHrhKUDkItLAmw5AEwI74mQ51mljpiusGo0KOBNinptARHKdJIK0pCgdJUKKw0KQxiqWI0OuPs0mQyCq0HD/99NOMGboUTgGbSc0moAbe4IVj+CMwumBRDkDJCZMkJIBTNqDa3ASaIINDQA+frTnA+YF4UV/36KgiS4zAGsHpD9FVNBTSAIOXzpWVEWqKr8sOYxCmSeiIItaytuvorMGmTMgthLFSaKIjzVQkAUOMitsQ54mHKU1RcAnXHELwzEL0QtHohwR5uOAkIVFzg1FUYSi3gUb18dbGdIGOeAblJKCbCoSGrJUT2B9F7EcvQJrnQyNOi0mnCS8hNStACAunP0QTojSEfkCL/Agz5DYVYVc6BGp1PAZjIuFIaSoESdD1534FEzgbxGPokJhjpkHD8CRAEyQHIDx4DSUUWwDOHLiLq3hq4jvvvPOSTgqms4Yzig11pk73UnqFoSXOABKyJ+pqlPWdL4gomimOfGgLcTTEaQSBbGzJJqCqi3iBh5SUwkuIePFu/NNdNDH/4xWR8r6Ax7qP3VB6zysU3tlU0GCI6xwH8vr375/DkJObLhJQrkNQFcq6BEsxFVx84pEchNAWjkTwIMraBh37iI/gilun7eEeswidgiAjfQM7XARtSeikoGqWVzUOUByVjGEDrOkHmEGJiuIWPSE6uIi7+GhT1CKkLElHneAMJNBh2mNPElJQAudeBeThpj90oT/slKNAo1h4P/uFLtfQGCrEB03WhBBaZSL0OUpBGMo04yaVB1/JeBgHdUwVVc1CuIzDggFXA5Bhx3grMNWnDRSWOBJNOgLONtIN05l7QNN0xkadIMFUYviNw6xK0VCMfRFNgmo/jeAmYrKmZhFrAkkbTHxEVLwaQocIKMRBF2ElnmzUsNWMoiroBp2jpLoBZhYmkHyeBXEEQmRytAnq8F4vSyRkcQ6iaGAMYhAE2iwSR9moArMwSi5REMdHhWNlxnF/kGUidR2PFdmpkFVDBB3hGpoFVRI1g9AKCFNgFOQE8jB6cyhrQKTmNPyRBJEw2wuQsgsM3/EUQgRFIJ3JdZfHU2bqik84awoDZ66BPoJzn+R0ET91jk4QWN0RhKHEmOs5+6OOfVxDTwWEIqM4UVVk64M0BHISKERNFunzegNEbwpNxB1VoJTDQVLTOVxjF/yS0PFIVcZRU1YNI8ZNCxMUUFMgFmhRgxH1JToUm2AJXlA4q3iKZUDRFTaFIlDBnuwJNQSK+BJa7w5AFc85iuTECLXipVPoZC/zhAIbrEprOA8UKSCRhVhuxj3kZ/1mcVBxkYWYkFSUPeIbDhISyUkM3HEIHA1INEFwxmVnb/BTXYHqMCo50AiaVXEOAlnHaeMz3WGndEiRwBUyFJrqgzN0sk1uBeY1o2gC4ZSoRkEybmue664pLmpBOjTTHSi3f74UtYHJCcwlB7LGYkrK0nRSYnhnkFAgk5pFPGsY8S7BvWzV3ECUWKFKszLwsyaBc1133K/giixQaARXaANt93ElAZsR2BulV1B001kDF9RooEbht0Kyc9OqmKGIdmkqikK1PVCx6Rx1tzgVxTVqDRk2osxgzXdBjUjagEf7XBV1j1VKUDdxk5rrji4KEGJqtCao3IB1ogbociAJ6Sw7Bneqb0BDUWuzVNpgb+iThPU0SiOgidawPIVRRAUkfqwPYhRZjJyHCDc8dJDgqaClcziqeoKjvrqtirhsA44BZgpnkmOXBIXQsB6BSsKECDl0xXWdpBXu9zw6eQbyzCHuAXH04ETmDIW1Dv5CERijmv3EplEgLiluRQC5FLrZV3PsSXPQEDWcEQgsFDV2w74kAupEDp8EZxTFb1w2kHAMi6icBC3iHl4M6gqom2yJdbFDAbE5bqIb7Afa7ElUUY+2sGDJUWgdphVgzCEUh8t4mwQ1pkLCyxUMcpRePJwAyswHYiV4Bi33ciP7uZ/tcwixNAcacHXEZVuS1WFVpay8XMUoqwlNdXHa2ItL3tawLa+rHF6IDZGjFdbGdUjSMehSJDbK7qzj2KzwCk39HYrMCWyOvXIZQ5c9qL7BDZ9Rw/2SsB8Eo4k/wom6aAFF4qo3zOhMs2gFyjQJ1bs9ClkvQ3RVVcFT99iewFRdwCrrM7M4tBh0oIe1UHDqr3j0hNgpoCDQwwyAg57VYd01uUlG0exhT8JKpBWevdEnqMNv1KITEKkwOgrS7A9a6ztHa3AVVCobhRRi7J5W36nheKk0zljYdQtQSx4NzoREZ2wEvqrtCOsIas7GVZBlZ54hUCCJr0SOlYGyP51DPc/Xmd36GsKNKLiJkfCWu0iKS/kcMtiwmLmDgtIrcwUUQwkUK7ppEBo1CPrECEmNwDgsGDwIR70zwzWdMmKCkUQFwG4oqmoKRNUtTp3BmJMoKp0wxprxQQ6/cV0x2R6uowZUOGRZi2tAnSGHgBE73VRczxAyBaUxTqyQ5V7dFb/YPENrUNLsT2yhqr5vMC6jBKFlmw2M8ZDn6ioboqbEgu3pFhuqN7MWlhDRwmu8AnWcwk9wZTWsB1V0xkbu87wgBGpNvgwxZgGChYLWtxa0oIlZI/36fwnQEDHREPAFbc3gBPYkdChnTXsqFjQ5Myi4HNHY3s4yeV5wytJlwYEs8bGQSgrQNAU2ugWyOlwvSS0gGH/gaxPUIWQERpCqzat117o6W3M6u8VHnu7QJEDCypppg7W4BSTSKHCnRcZfc4NmOZlKyOxhyDF6cwJip+hoAikQwi2M3sZxmqSRTXDERdV1BuRw0uxskHBNYmiCOx6sBFSbTkAMRWafilZHYHxEKTZofrA2OEoERdgZPalzB32QHETxfM3RGOMt0YUQqOBAaCOe+mZZfBpDPKGGhcoJNQ1s1qQR9lUYA5wiNh2loiCrWiqvktxBpfDJ6KvCuEgoLUiJVR8qdJKlSdDnCigpm0jMmIteAjI8ESCB0RHwxUdIqm+SDWG6Bo3mCshRcG6ji+BOwPCbLikySIM6jiu2GNCXrkGXswy9YI/GaqiWV6OmeFWDj3duAufnOK0wVNX05igrGZzlFIRS9RWMSOkoLttYoAJEJR3TQYGgh6Ibp+1NS+zhfkUlqOhFvc0lXmdpjKHKTIAWgvc8mBNcg464WaNOU33Pu26GIbDchMUTWa5kroC2Bl54ZWEwxl0wo+CScubnAAYbQsQRWIxumbnBXYJGUbCFFPM/d0EVSoyXuE1rwJNtOQu4zxnD1CdodLS2GQR9NAY6dcqcgS6gzm5RFDXZNItELS4E5ihJ/CBMcekHhNTBS3EUzPDUcMhmOqULoGhak5Dg8ZeACF7lwBPEBK6jCqhgJWbghRbEU2Agruo4aeDRUcMNvisMUSR0Poc6eyqyUdo61izuEi2zAZRAJGdSSM0xyaKhODVCUzUPRSAGWuhSrU+/CHRTSTfxVTxjKzZVQZCSGOXESTYEcsQRbyUkIMHweRA18IBszQYqD/K0xEyAIuiGZqilSBJhnwTUvdYyitMayLEGMSR61mFx7BSt6BRue3eBlgYrp0jPohtnkyjKuIewQovPIbgZP50GeSeRA0GiRnzwxsHEAKOjOsDaXCeSuIrHIOZlCnWnG6BlZFVlySkW/QBnNFIYIolmpkuQhSQiRijtRbQ4jnvZoAkRxHm/RGmRNU2whJaF6jBlh06zDWSL3199pYdGGkSI7d1wSAJ4qRtU2nRmECFCeOoBaqp6OuI6qIMZOKMJ6ugEIVRAegLS9AN/qbJCKxiICoRO4LMEFYs+6Iq9dBbFqL2Cgjfu0gX0UCDUIcAGHkjlFoRU/E583AGyPE/wIINTsVMNI/pNoAYHczNIgpDA+Snuu0k3CRUrUyRDEbQIlu2wQzTSISKDJgKGFHDVMUXCe51UUHoD6lCFftwERdDNfu63Jiqik0ZAmEMTTYAOzgBx0ORNksHMnt4r4DxR5QRGaA0wjNVkyB2gsekQaFSSRkXwcTMBw/P6gYEZQWI6R3yIiaDRxRrgWd+9E63iNc3gFgVNokU4DVlGcWLnOi1BK8MV2nEGoqbAkOO+Ort4y2QvCHFA4u+apSGElgUTcwUzIEGrplrLmK+BUNsECc4UE1fxT2IgSPVd5+tsjyjqBF56h4B30ALClF6iPJdY6gJncZ9i2aPsi5MIHFwdpiAD3F0nwvTIOj4HVd0kYvVOD7fpBsjrMu8XlyZ5o6Qp4mLDUM2aFdwxn9DTLxSxVhOASnnIezuaYAPeTil1wMCDvyzT/E3JKb4NwVBH6gsKi/NeImU0ZkEgqrD4CxmGH4VhtfW9ZA0mJkHP2U9nCZ1zhumPllBy1DMKQ6wCEVDHb8/REkJevwe2J02yhr0UEnLcYxZoTl8UknjppGoLCG91UVGIk811GH/B1aKg6nnco/b4SEtU2rytgyCt0v6sQ294MTvTJRYnKQVlW2YDFIEua5k50Av6iJ5BzUQHyhyJaGsgLRMXflufw3ixImbijcYaAy32REcFawRFVSgrNxAEWIEv/njYQhRUh4kTrkvKbEDR3VdKz5JYEcGk1AKmK2AoIVBFJ6hSMPrhusDqxStkEVsdtgbhcsao3whBEBRKUlLmAYIKzZxITmKjEwpntiC6CsX2xQZFNCh/Kkt8wIKS2gRcKC71xDMBGjs5hOsOKUSJ4FBqn+Eu2IEsuAqe8LAiXcBZxTHg8GbvEiTgfUF9maJIKEdDFI6vQ5o9JGTIghrUMObSFTFBLdQRVIlqELjbH9cNdvbhaqgin3oL1YgcnuouPuOTIcGkBnoUtV54oop7QNFcrXCqKyEaYsLiEoIAYed6yGFthBBkQVUQUCVR4ml9ii9B3KbgKEQXzAQaQX/K1mgK8YY6nIceFCak3IOAQpO9rENvFIUIU34OAIXWbzgEhoYMA4XRFuRwlSjhFNgYX1UYxNzjjyXVz+BtAJbgzrdVXofxzXygqIRHNwXAWSRLdNEJivgyiwJVSJKcAqKhgnILBbanP7YmNiiRUL1vZHsowzVQRoFRl8YRZ9Qg1tZsJsB6lQSmLBBsOYDpymBjKvQg+EEMaOEpO8RZxbIo69Tleu8GQTpmpsB5wkN5FZA41otWPEYbKEQjGqKA4mFb1uLx9qwfROA75EEiu3Mdt9HIyE3IFROanCbrx5SaTbcgSx75ThCfKLZBx1EUf7lAHUVVXGdBhn8bJbkDy8JVUARDVBIAUVIUyk5b0Ima17c9goM2ewrKkKTIeK57EoFC1/FU8XSbNVpf8ASUS4E6XYEiseM7tEIlVJgM2bR1rM96FR0lxd9MUPzSBoRIdTkCCOoEPtmsfmZOI1RTUiBFTPAOpPBaV8BQciikQwKyMUT5nJZAC24rpM85Cc1QUCiTKGTyeQMaqyS+knVPfbeINuIGd52t/1CpL20URnGNvtCJjmJAPYNXfjVWv8ujps7lFF11LQay4Oo4qrM66CADWl5GCkCSBEwxJYE+9SJEF3XVzM+72avDCdQokCAlR/GhRpIaAo3Qh7+GLDMHOoKw8wXKUX708aw1JEkgnSg1tL4ZgiajPqrQME2DQg1oNrQIX2QTVB8fCZqXFRbXASJmEUGrvIEIx3UIvHUBX6HHLOENE89nq9YkpgqEPmxRArwe/ayluPzdQUtwxBIqdMoBioVyArzlNoYldFRoMDcEiV/MiqfQnlVo0yfb1TCToUZoYh6IVM5CICdIosURdIm64igFZXm6qKsqahGFEizNwD12x2NZkhNe/ZRNAJ5XRIouYPezUFSDMsUknp6j5qwWjyGTlhBS6EI3+iQ2jbEfB4JikLYH6jrE1c/zrY/vvqdwPz3TMJrS6tU3VQU1ByCdYlksRMC45YiLV+wKvFgIjhpLTWFmfa7gmMpZCFW950MhcGNNuE8fQBFCfG4fHUI/gUKSIuKrNRWPwJkbNMO6hifjLZoopOZBir3NAxDjc0WEMFpDFOmUSVEjFbDhIHvBJx3WRRXkr1wAbAwPioM79QsryHGfjQ1BLIwLEEbWSEN4uKB1zvMCExQRsjndQBd7mgl4PIhDlmBRp76ZpjmeR0FTKCE2EaIMu4Qe2mU/k6whyHVo0mn6RtDtx81oCV1rRMO0RMxUXnfBDiLAFFwtXP9s4DrrhAyDjiR5sA7qBqFxH74KDlTrvzpAlCCyQBwmnnhKrHREoNQc+swcOms/NAFxTsKJnFnYLlTxeoMXWJswJQZZimysds099IWgajRbVBzIbRbn1SAOGk5pKmzGdp2wEAxWRSucoIiQxQSosz7DNUpNwRXUqAo50CFJ1oRe7sNj4mUuAHWCWb8DkpQXH6AM5ixRsWmRNepn9hKyD/Ejws4oBNXMr/iskq4pmncQ4jaA0QaW7v78ubxugEz9/w5o47XuECTiU/+RQZXBlHqDtQ4bW1HFWGwDRVRl0OMw9bU1GAsW3BW1fplevzBxn+4SOMjjSuBON6BMUhSdrxNh4guBBNgUq2ES5VB0Bh2JIB2xl/VphHs5EB1B51aw1EVDjso6zLASN+o0Pqs+f6ekIFv/R0BcwJlH83yfW0N3FYzo0Jl6xWZg0gW2x7Lw3KDifMCBdMY8QHA9yx3okCHKNOdeOuG0V2+RaRfHQV0Uthau+7O+AioWFLFhFlkC3iwiAfDj/TqMw+BhIfDC4foPLpsRMgXyOcEDN8qOf8QMjTgJBSeOEsVTwkdwFcZEJ2AQhSAdkYTA6xyg0OYM+uI8gMv+6Il9wJpGmQoVy3QKTVDDBSBRU+VjZJYjOkGSQplrGmVUTdCg6gSGuuIq1aeueMkK8dYmFnGMLb8XiECpOmqAI72oX3LRGesainRRsOiBw3RBsQ0+9rceKFtHMmyantAlCCFqNIVg6mR9K6yJ1ibQYlN8I7eiQl79GpVO1I+rCO9/aBDaSi0pyEoAAAAASUVORK5CYII="), t.enableVertexAttribArray(r.position), t.enableVertexAttribArray(r.texcoord), t.uniform1i(r.image, 0), t.uniform1i(r.threshold, 1);
}
await p(), e.addEventListener("webglcontextlost", (e) => e.preventDefault()), e.addEventListener("webglcontextrestored", p);
function m(e, t, n) {
	return new Promise((r) => {
		let i = t ? document.createElement("video") : new Image();
		i.src = e, i.crossOrigin = n, t ? (i.playsInline = !0, i.muted = !0, i.loop = !0, i.play(), i.addEventListener("playing", () => r(i), { once: !0 })) : i.addEventListener("load", () => r(i), { once: !0 });
	});
}
function h(e) {
	n.clearRect(0, 0, 1, 1), n.fillStyle = e, n.fillRect(0, 0, 1, 1);
	let [t, r, i, a] = n.getImageData(0, 0, 1, 1).data;
	return [
		t / 255,
		r / 255,
		i / 255,
		a / 255
	];
}
var g = class extends HTMLElement {
	constructor() {
		super(), this.lightColor = [
			1,
			1,
			1,
			1
		], this.darkColor = [
			0,
			0,
			0,
			1
		], this.intersecting = !1, this.canvasProp = null;
	}
	static observedAttributes = [
		"src",
		"src-canvas",
		"threshold-map",
		"dark",
		"light",
		"width",
		"height",
		"object-fit"
	];
	async attributeChangedCallback(e, t, n) {
		switch (e) {
			case "src":
				this.mediaSrc = n, await this.initMedia(), this.resizeCanvas(), this.draw(), this.sync();
				break;
			case "src-canvas":
				this.canvasSrc = n, await this.updateMedia();
				break;
			case "threshold-map":
				this.thresholdSrc = n, await this.initThreshold(), this.draw();
				break;
			case "dark":
				this.darkColor = n ? h(n) : [
					0,
					0,
					0,
					1
				], this.draw();
				break;
			case "light":
				this.lightColor = n ? h(n) : [
					1,
					1,
					1,
					1
				], this.draw();
				break;
			case "width":
				this.width = +n || null, this.resizeCanvas(), this.draw();
				break;
			case "height":
				this.height = +n || null, this.resizeCanvas(), this.draw();
				break;
			case "object-fit": this.objectFit = n || "contain", this.resizeCanvas(), this.draw();
		}
	}
	async connectedCallback() {
		this.crossOrigin = this.getAttribute("cross-origin"), this.immediate = this.getAttribute("immediate") != null, this.root = this.attachShadow({ mode: "closed" }), this.initCanvas(), await Promise.all([this.initMedia(), this.initThreshold()]), this.resizeCanvas(), this.initObserver(), this.immediate && (this.initialized = !0, this.draw(), this.sync());
	}
	get srcCanvas() {
		return this.canvasProp ?? this.resolveCanvas(this.canvasSrc);
	}
	set srcCanvas(e) {
		this.canvasProp = e || null, this.updateMedia();
	}
	resolveCanvas(e) {
		if (!e) return null;
		let t = document.querySelector(e);
		return t instanceof HTMLCanvasElement ? t : (console.warn(`dither-dither: "${e}" does not match a <canvas> element`), null);
	}
	async updateMedia() {
		this.isConnected && (await this.initMedia(), this.resizeCanvas(), this.draw(), this.sync());
	}
	disconnectedCallback() {
		this.stop(), this.destroyObserver(), this.media?.pause?.();
	}
	initCanvas() {
		this.canvas = document.createElement("canvas"), this.canvas.style.display = "block", this.canvas.style.imageRendering = "pixelated", this.root.appendChild(this.canvas), this.canvas.setAttribute("role", "img"), this.canvas.setAttribute("aria-label", this.getAttribute("alt") ?? ""), this.ctx = this.canvas.getContext("2d");
	}
	isCanvas() {
		return this.media != null && !(this.media instanceof HTMLImageElement) && !(this.media instanceof HTMLVideoElement);
	}
	isVideo() {
		return this.canvasSource || !this.mediaSrc ? !1 : this.getAttribute("type") === "video" || this.getAttribute("type") == null && [
			"mp4",
			"webm",
			"ogg"
		].includes(this.mediaSrc.match(/[^.]+$/)[0]);
	}
	async initMedia() {
		this.stop(), this.media?.pause?.(), this.canvasSource = this.srcCanvas, this.media = this.canvasSource ? this.canvasSource : this.mediaSrc ? await m(this.mediaSrc, this.isVideo(), this.crossOrigin) : null;
	}
	async initThreshold() {
		let e = this.thresholdSrc ?? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAbkklEQVR4nD3bZdhVVRMG4KVY2Ah2t2Jid3diYRd2d7fYYAvYIAaCCioo2I2BYHd3d+f43XNd870/99l7rYknZu1z3rbmmmvGb7/9FmPHjo077rgjlltuuejbt2/stttucfbZZ8fxxx8fq622Whx00EExfvz4mHXWWeONN96Iyy+/PPbZZ5/4888/Y7PNNsv7Pv744+jQoUNstdVW8cUXX8TAgQNjscUWix9//DEOPPDAWGihheKkk06KnXfeOZ5++umYd95547PPPov77rsv/v3333juuefi0ksvjammmiq23XbbOOuss+LXX3+NJ554ImN7//33Y+WVV46ddtopzjjjjBgyZEh069YtRo0aFX369Mm9V1pppbjxxhszzmeffTamnHLKjOfxxx+PiSaaKAYMGJD3W8O6bejQofnwTDPNFKecckom6k9wL774Ymy++ebxyCOPxJ133hnnn39+3HzzzTHFFFPEuuuuG6effnrcfffduZnAl1hiiXjooYfCmmuttVYmIrlNNtkkWmu54XXXXZefXXLJJXHrrbfGvvvum4kKfPfdd8/1Pv/88xg0aFAcccQRMc8888SGG24YE044YXz77bd5/f77749JJpkkfvrpp3jzzTdjzjnnzHjE+fPPP2fxrC++33//Pff54IMPcq+vvvoqpp9++nzuqKOOivb1119nFT101VVXZRctNs0008RNN92UDyjOkksuGT169IhjjjkmA3nsscdihx12yEDeeeedrPp+++0XXbp0yQIee+yxGcRLL70Up512Wmy33XZhL5svs8wy8csvv0SnTp0yuWuvvTb3mHTSSePkk0+ORRZZJNZYY4148MEHM9Bdd901Tj311JhxxhkTJYsvvngcdthhcfHFF8c222wTe++9d3zyyScZG5Ttv//+8e6772ah5QatimRtz3puxRVXjMknnzyajqnMK6+8khDq2rVrdkonXNfZCSaYIN577734+++/Y5VVVsmu6CR4q/iqq64azz//fJx55pmx/fbbx5NPPhnzzz9/rLDCCpno7LPPHsOGDctADj/88Ezs5ZdfTsSNGDEiC/r6669nUUEeCmeZZZb4/vvvE01LL710NgeNtthii/jjjz9ittlmy/vFM3z48Ljiiiuic+fOGQe6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";
		s.has(e) || await f(e);
		let { thresholdTexture: t, thresholdMap: n } = s.get(e);
		this.threshold = t, this.thresholdMap = n;
	}
	async resizeCanvas() {
		if (!this.media || !this.canvas) return;
		let e = this.media.videoWidth ?? this.media.width, t = this.media.videoHeight ?? this.media.height, n = e / t, r, i;
		this.width && this.height ? (r = this.width, i = this.height) : this.width ? (r = this.width, i = this.width / n) : this.height ? (i = this.height, r = this.height * n) : (r = e, i = t);
		let a, o;
		if (this.objectFit === "contain") {
			let n = Math.min(r / e, i / t);
			a = e * n, o = t * n;
		} else if (this.objectFit === "cover") {
			let n = Math.max(r / e, i / t);
			a = e * n, o = t * n;
		} else a = r, o = i;
		this.canvas.width = r, this.canvas.height = i, this.renderWidth = a, this.renderHeight = o, this.mediaWidth = e, this.mediaHeight = t;
	}
	draw() {
		if (!this.initialized || !this.media || t.isContextLost()) return;
		let { width: n, height: s } = this.canvas;
		e.width < n && (e.width = n), e.height < s && (e.height = s), t.viewport(0, 0, n, s);
		let c = (this.renderWidth - n) / 2, l = (this.renderHeight - s) / 2;
		t.bindBuffer(t.ARRAY_BUFFER, a), t.bufferData(t.ARRAY_BUFFER, new Float32Array([
			-c,
			-l,
			this.renderWidth - c,
			-l,
			-c,
			this.renderHeight - l,
			-c,
			this.renderHeight - l,
			this.renderWidth - c,
			-l,
			this.renderWidth - c,
			this.renderHeight - l
		]), t.DYNAMIC_DRAW), t.vertexAttribPointer(r.position, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, i), t.vertexAttribPointer(r.texcoord, 2, t.FLOAT, !1, 0, 0), t.uniform2f(r.resolution, n, s), t.uniform2f(r.thresholdSize, this.thresholdMap.width, this.thresholdMap.height), t.uniform4fv(r.darkColor, this.darkColor), t.uniform4fv(r.lightColor, this.lightColor), t.activeTexture(t.TEXTURE0), d(o, this.media), t.activeTexture(t.TEXTURE1), t.bindTexture(t.TEXTURE_2D, this.threshold), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.drawArrays(t.TRIANGLES, 0, 6), this.ctx.clearRect(0, 0, n, s), this.ctx.drawImage(e, 0, e.height - s, n, s, 0, 0, n, s);
	}
	sync() {
		this.media && (this.isVideo() && this.intersecting ? (this.media.play().catch(() => {}), this.start()) : this.isCanvas() && this.intersecting ? this.start() : (this.isVideo() && this.media.pause(), this.stop()));
	}
	start() {
		if (this.cancelFrame) return;
		let e = this.media, t;
		if (this.isVideo()) {
			let n = () => {
				t = e.requestVideoFrameCallback(n), this.draw();
			};
			t = e.requestVideoFrameCallback(n), this.cancelFrame = () => e.cancelVideoFrameCallback(t);
		} else {
			let n = () => {
				t = requestAnimationFrame(n), (e.width !== this.mediaWidth || e.height !== this.mediaHeight) && this.resizeCanvas(), this.draw();
			};
			t = requestAnimationFrame(n), this.cancelFrame = () => cancelAnimationFrame(t);
		}
	}
	stop() {
		this.cancelFrame?.(), this.cancelFrame = null;
	}
	initObserver() {
		this.observer = new IntersectionObserver((e) => {
			e.forEach((e) => {
				this.intersecting = e.isIntersecting, e.isIntersecting && !this.initialized && (this.initialized = !0, this.draw()), this.sync();
			});
		}), this.observer.observe(this);
	}
	destroyObserver() {
		this.observer?.unobserve && this.observer.unobserve(this);
	}
};
customElements.define("dither-dither", g);
//#endregion
export { g as default };
