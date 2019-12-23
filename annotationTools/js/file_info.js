/** @file Contains the file_info class, which parses the URL and
 * sets global variables based on the URL.  */

// file_info class - only works for still images at the moment

/**
 * Keeps track of the information for the currently displayed image
 * and fetches the information via dirlists or from the URL.
 * @constructor
*/
function file_info() {
    
    // *******************************************
    // Private variables:
    // *******************************************
    
    this.page_in_use = 0; // Describes if we already see an image.
    this.dir_name = null;
    this.im_name = null;
    this.collection = 'LabelMe';
    this.mode = 'i'; //initialize to picture mode
    this.hitId = null;
    this.assignmentId = null;
    this.workerId = null;
    this.mt_instructions = null;
    
    // *******************************************
    // Public methods:
    // *******************************************
    
    /** Parses the URL and gets the collection, directory, and filename
     * information of the image to be annotated.  Returns true if the
     * URL has collection, directory, and filename information.
    */
    

    this.getParam = function(param){
        return new URLSearchParams(window.location.search).get(param);
    }

    this.ParseURL = function () {
        var labelme_url = document.URL;
        var idx = labelme_url.indexOf('?');
        if((idx != -1) && (this.page_in_use == 0)) {
            this.page_in_use = 1;
            var par_str = labelme_url.substring(idx+1,labelme_url.length);
            var isMT = false; // In MT mode?
            var default_view_ObjList = false;
            do {
                idx = par_str.indexOf('&');
                var par_tag;
                if(idx == -1) par_tag = par_str;
                else par_tag = par_str.substring(0,idx);
                var par_field = this.GetURLField(par_tag);
                var par_value = this.GetURLValue(par_tag);
                if(par_field=='mode'){
                    this.mode = par_value;
					if (this.mode != 'c' && this.mode != 'f'){
						$('#prevImage').hide();
						if (bname == 'Netscape'){
							$('#label_buttons_contrast').css('left', '545px');
						}
						else $('#label_buttons_contrast').css('left', '525px');
					}
					else{
						$('#prevImage').show();
						if (bname == 'Netscape'){
							$('#label_buttons_contrast').css('left', '585px');
						}
						else $('#label_buttons_contrast').css('left', '565px');

					}
                    if(this.mode=='im' || this.mode=='mt') view_ObjList = false;
                    if(this.mode=='mt') isMT = true;
                }
                if(par_field=='username') {
                    username = par_value;
                    this.workerId = par_value;
                }
                if(par_field=='collection') {
                    this.collection = par_value;
                }
                if(par_field=='folder') {
                    this.dir_name = par_value;
                }
                if(par_field=='image') {
                    this.im_name = par_value;
                    if(this.im_name.indexOf('.jpg')==-1 && this.im_name.indexOf('.png')==-1) {
                        this.im_name = this.im_name + '.jpg';
                    }
					imgName = this.im_name;
                }
                if(par_field=='hitId') {
                    this.hitId = par_value;
                    isMT = true;
                }
                if(par_field=='turkSubmitTo') {
                    isMT = true;
                }
                if(par_field=='assignmentId') {
                    this.assignmentId = par_value;
                    isMT = true;
			if(par_value == null){
				this.assignmentId = this.getParam('assignment_id');
			}
                }
                if((par_field=='mt_sandbox') && (par_value=='true')) {
                    externalSubmitURL = externalSubmitURLsandbox;
                }
                if(par_field=='N') {
                    mt_N = par_value;
                }
                if(par_field=='workerId') {
                    this.workerId = par_value;
                    isMT = true;
                    
                    // Get second-half of workerId:
                    var len = Math.round(this.workerId.length/2);
                    username = 'MT_' + this.workerId.substring(len-1,this.workerId.length);
                }
                if(par_field=='mt_intro') {
                    MThelpPage = par_value;
                }
                if(par_field=='actions') {
                    // Get allowable actions:
                    var actions = par_value;
                    action_CreatePolygon = 0;
                    action_RenameExistingObjects = 0;
                    action_ModifyControlExistingObjects = 0;
                    action_DeleteExistingObjects = 0;
                    if(actions.indexOf('n')!=-1) action_CreatePolygon = 1;
                    if(actions.indexOf('r')!=-1) action_RenameExistingObjects = 1;
                    if(actions.indexOf('m')!=-1) action_ModifyControlExistingObjects = 1;
                    if(actions.indexOf('d')!=-1) action_DeleteExistingObjects = 1;
                    if(actions.indexOf('a')!=-1) {
                        action_CreatePolygon = 1;
                        action_RenameExistingObjects = 1;
                        action_ModifyControlExistingObjects = 1;
                        action_DeleteExistingObjects = 1;
                    }
                    if(actions.indexOf('v')!=-1) {
                        action_CreatePolygon = 0;
                        action_RenameExistingObjects = 0;
                        action_ModifyControlExistingObjects = 0;
                        action_DeleteExistingObjects = 0;
                    }
                }
                if(par_field=='viewobj') {
                    // Get option for which polygons to see:
                    var viewobj = par_value;
                    view_Existing = 0;
                    view_Deleted = 0;
                    if(viewobj.indexOf('e')!=-1) view_Existing = 1;
                    if(viewobj.indexOf('d')!=-1) view_Deleted = 1;
                    if(viewobj.indexOf('a')!=-1) {
                        view_Deleted = 1;
                        view_Existing = 1;
                    }
                }
                if(par_field=='objlist') {
                    if(par_value=='visible') {
                        view_ObjList = true;
                        default_view_ObjList = true;
                    }
                    if(par_value=='hidden') {
                        view_ObjList = false;
                        default_view_ObjList = false;
                    }
                }
                if(par_field=='mt_instructions') {
                    // One line MT instructions:
                    this.mt_instructions = par_value;
                    this.mt_instructions = this.mt_instructions.replace(/_/g,' ');
                }
                if(par_field=='objects') {
                    // Set drop-down list of object to label:
                    object_choices = par_value.replace('_',' ');
                    object_choices = object_choices.split(/,/);
                }
				if (par_field=='showimgname' && par_value=='true'){
					showImgName = true;
				}
                if((par_field=='scribble')&&(par_value=='true')) {
		             scribble_mode = true;
		        }
                if(par_field=='wordnet'){
                    if(par_value=='false') {
                        autocomplete_mode = false;
                    }
                    else {
                        autocomplete_mode = true;
                    }
                }
                if((par_field=='video')&&(par_value=='true')) {
		             video_mode = true;
                     bbox_mode = true;
		        }
                if((par_field=='threed')&&(par_value=='true')) {
                     threed_mode = true;
                }
                if((par_field=='bbox')&&(par_value=='true')) {
                  bbox_mode = true;
                }
                par_str = par_str.substring(idx+1,par_str.length);
            } while(idx != -1);
            if (video_mode) return 1;
            if((!this.dir_name) || (!this.im_name)) return this.SetURL(labelme_url);
            
            if(isMT) {
                this.mode='mt'; // Ensure that we are in MT mode
                view_ObjList = default_view_ObjList;
            }
            
            if((this.mode=='i') || (this.mode=='c') || (this.mode=='f')) {
                document.getElementById('body').style.visibility = 'visible';
            }
            else if((this.mode=='im') || (this.mode=='mt')) {
                var p = document.getElementById('header');
                p.parentNode.removeChild(p);
                var p = document.getElementById('tool_buttons');
                p.parentNode.removeChild(p);
                document.getElementById('body').style.visibility = 'visible';
            }
            else {
                this.mode = 'i';
                document.getElementById('body').style.visibility = 'visible';
            }
            
            if(!view_ObjList) {
                var p = document.getElementById('anno_anchor');
                p.parentNode.removeChild(p);
            }
            
            if(this.assignmentId=='ASSIGNMENT_ID_NOT_AVAILABLE') {
                window.location = MThelpPage;
                return false;
            }
            if(this.mode=='mt') {
                if(!this.mt_instructions) {
                    if(mt_N=='inf') this.mt_instructions = 'Please label as many objects as you want in this image.';
                    else if(mt_N==1) this.mt_instructions = 'Please label at least ' + mt_N + ' object in this image.';
                    else this.mt_instructions = 'Please label as many objects as you want in this image(at least ' + mt_N + ' objects).';
                }
                if(mt_N=='inf') mt_N = 1;

        var desc_text = "";

        //var html_str2 = '<font size="4"><b>Keywords that best describe the entire painting</b></font>&#160;&#160;&#160;<font size="3">Please list at least five keywords that best describe the entire painting.</font><br />';
		var html_str2 = '<div id="desc" style="float:left; width:40%; height:500px; overflow:scroll; margin-left:40%; margin-top:20px"></div>';
		var desc_title = '<div id="desc_title" style="margin-left:40%"><b>Scroll down to see the entire description.</b></div>';

        $('#mt_feedback').append(desc_title);
		$('#mt_feedback').append(html_str2);

		console.log(imgName);
		console.log(typeof(imgName));

		if(imgName == "1.jpg"){
		    document.getElementById("desc").innerHTML = "<b>DESCRIBING YOU THE BRERA MASTERPIECES</b><br> <br><b>The Kiss by Francesco Hayez</b><br><b>Brera 's picture gallery</b><br><b>room 38</b><br> <br>Morphological description<br> <br>The work is entitled Il bacio. Episode of youth. Costumes of the fourteenth century, but is commonly known only as The Kiss. It was painted in 1859 by Francesco Hayez.<br>It is an oil on a rectangular canvas, with the longest side placed vertically: it is 112 cm high and 88 wide.<br>The subject to be described is rather simple: the picture depicts in a realistic way a young man and a young woman tightened in a passionate embrace, while they kiss on the lips with transport.<br>The two, elegantly dressed in medieval clothes, are inside an empty space in a period building.<br>The point of view is frontal, the two lovers are portrayed in full length and on a reduced scale: they measure about half of the whole painting.<br>To better describe the work, let us now try to imagine it divided into 9 sectors of equal size, obtained by crossing three columns with three rows. To each sector, by convention, we give the numbering used in telephone keyboards. From left to right: 1, 2, 3 at the top; 4, 5, 6 in the middle; 7, 8, 9 below.<br>We begin the description from the central sectors, 5 and 8 (and partly also 2), where the two young people are placed.<br>The two are located one in front of the other: the female figure in the foreground, turned away, is enveloped by the male figure, turned towards us instead.<br>The taller young man bends over his beloved to kiss her, gently holding her head in his hands: with his right hand he gently lifts her face and with his left he supports her neck. While holding the right leg straight to the ground, he bends his left leg and rests his foot on the first of three steps of a staircase that rises and occuppies sector 9 of the canvas.<br>The young woman in her beloved's arms, reflexively responds to his bending over her, by arching her back, holding on to the young man's shoulder with her left hand. To kiss him she barely turns towards us, and so we see the left profile of her body and face.<br>The painter pays great attention to clothes.<br>The young man is wearing a pointed hat, dove-gray and with dark feathers on the side, from which brown and frizzy hair comes out. His face is almost completely hidden by the headdress.<br>He wears a wide brown cape down to the knees, which slips off the right shoulder to partially uncover the dark green jacket. Under the open cape, tied to the belt, we see a dagger. A red tights and brown leather shoes complete his clothing.<br>The young woman has long light brown hair gathered in a soft hairstyle that leaves them partly loose behind her shoulders.<br>She is wearing a long light blue dress, so shiny that it looks like silk satin, with a tight bodice, tight sleeves, and a wide skirt that falls all the way to the floor. Under the dress a white shirt emerges from the collar, the cuff and the sleeve, opening around the elbow in a broad puff. Golden embroidery adorns the wrist and neck of the dress, while a cord, always gilded, tightens the hips.<br>A wall of blocks of light stone is the background of the scene, especially in sectors 2, 3 and 6, while the floor is made of brick-colored terracotta tiles, arranged in a herringbone pattern, and occupies sectors 7 and 8, and then stops in sector 9, where there are three large ascending steps in light stone.<br>In sectors 1 and 4, on the stone wall, a thin and high column delimits an opening that introduces us to a rather dark space.<br>We can only see a part of the entrance arch that continues outside the picture.<br>Beyond this opening, in sector 4, behind a sharp arch, another dimly lit space is shown. in which we barely see, against the light, a human figure that descends to a lower floor.<br>The lighting of the scene, apart from this dark area on the left, is intense and comes from a source outside the painting, at 10 o'clock.<br>The light strikes in particular the left side of the girl, lighting the folds of the blue satin of the dress with almost white reflections, and projects the shadow of the two youngs quite clearly on the stairway and on the right side of the canvas.<br>On a background entirely played on neutral tones, the bright colors used for the clothes of the two young people, flooded with light, stand out.<br> <br>Certified description prepared in October 2018<br> <br>This description has been made<br>from the Educational Services of the Pinacoteca di Brera and from the Team DescriVedendo<br>with the National Association of Subvedenti Onlus<br>thanks to the support of Lions Clubs International Milano Borromeo and Milano Duomo<br> <br> <br><b>Artistic historical description</b><br> <br>This painting, much loved by the public and critics since it was presented for the first time at the Brera Academy's annual exhibition, has kept its fame intact until today, becoming a symbolic image of the Pinacoteca, as well as one of the most famous paintings of all the Italian nineteenth century.<br> <br>There are numerous versions of the Kiss: Francesco Hayez replied, in fact, several times this same subject, which received immediate success.<br> <br>The Pinacoteca, thanks to the gift of the client Alfonso Maria Visconti of Saliceto, preserves the first version, which was painted in 1859.<br> <br>In the same year the Savoy troops of Vittorio Emanuele II, king of Sardinia and future first king of Italy, allied with the French army led by Napoleon III, entered victorious in Milan, after having won the Second War of Independence against the Austro-Hungarian army. The liberation of the Lombard-Venetian territories from foreign dominion opened the doors to the Unification of Italy, which was proclaimed in 1861.<br> <br>Despite the amorous subject, the painting must be included in the so-called historical Romanticism, of which Hayez was a leader in Italy. The depiction of a historical or literary episode, set in a past time, becomes in the Kiss an allegory of the present and a firm expression of markedly political ideals of the Italian Unification (Risorgimento): civil commitment and love of country that prevail over private sentiment.<br> <br>The scene, characterized by a setting and medieval costumes, in fact, alludes humbly to the farewell of a patriot volunteer to his beloved: Hayez, who like other artists through his painting had witnessed the struggles of the Italian Unification, celebrated with this work the expectations and enthusiasm of his time. Hope and strong civic sense are concepts expressed here with a very synthetic image and therefore of great impact.<br> <br>Probably the secret of the power of this work, which has become almost an icon, is in having described the scene of a kiss so immediately that it becomes a timeless image. The half-hidden faces of the two protagonists and the presence of a few other elements concentrate all the attention on the action being carried out, made up of gestures that are as natural as they are engaging and passionate.<br> <br>Born in Venice in 1791, Francesco Hayez attended the Academy of Fine Arts there, to then complete his studies in Rome as a protégé of Antonio Canova, a great neoclassical sculptor. Strengthened by this experience, spent between the Greek-ancient statuary and the Raphael Rooms (Stanze di Raffaello) in the Vatican, he moved to Milan where he remained for most of his career.<br>Here he immediately came into contact with the intellectual circles of the city, which was in full ferment with the Italian Unification, and became one of its principal interpreters together with Verdi and Manzoni, so much so as to be defined by Giuseppe Mazzini as \"painter prophet (vate) of the Nation\"; in Milan he took care of the formation of future generations, receiving the prestigious position of professor at the Brera Academy starting from 1850; he was a skilled portraitist and tireless draftsman. He died at ninety-one in 1882.<br> <br>Il Bacio, which belongs to the mature phase of Hayez's career, includes some of the most characteristic elements of his painting, such as the theatrical-scenographic composition and the impeccable and rigorous elegance of drawing. The chromatic and luministic sensitivity, a legacy of his Venetian origins and the result of a long study on Tiziano and Giorgione, reaches absolute summits in the woman's splendid blue satin dress. According to a scheme dear to the artist, the neutral tones of the background and the diffused light but wisely varied in space bring out the brightest colors used for the figures in the foreground, which also have a symbolic meaning : the blue of her dress, his red tights and green jacket refer to the union of the two flags, the Italian and French one.<br> <br><br>";

		}

        document.getElementById("desc").style.float = "left";

        //var html_str = '<table><tr><td><font size="4"><b>' + this.mt_instructions + '  Scroll down to see the entire image. &#160;&#160;&#160; </b></font></td><td><form action="https://www.mturk.com/mturk/externalSubmit"><input type="hidden" id="assignmentId" name="assignmentId" value="'+ this.assignmentId +'" /><input type="hidden" id="number_objects" name="number_objects" value="" /><input type="hidden" id="object_name" name="object_name" value="" /><input type="hidden" id="LMurl" name="LMurl" value="" /><input type="hidden" id="mt_comments" name="mt_comments" value="" /><input disabled="true" type="submit" id="mt_submit" name="Submit" value="Submit HIT" onmousedown="javascript:document.getElementById(\'mt_comments\').value=document.getElementById(\'mt_comments_textbox\').value;" /></form></td></tr></table>';

        var html_str3 = '<table><tr><td><font size="4"><b>' + this.mt_instructions + '  Scroll down to see the entire image. &#160;&#160;&#160; <input type="hidden" id="assignmentId" name="assignmentId" value="'+ this.assignmentId +'" /><input type="hidden" id="number_objects" name="number_objects" value="" /><input type="hidden" id="object_name" name="object_name" value="" /><input type="hidden" id="LMurl" name="LMurl" value="" /><input type="hidden" id="mt_comments" name="mt_comments" value="" /><input disabled="true" type="submit" id="mt_submit" name="Submit" value="Submit HIT" onmousedown="javascript:document.getElementById(\'mt_comments\').value=document.getElementById(\'mt_comments_textbox\').value; get_desc(\''+this.workerId+'\', \''+this.im_name+'\'); provide_code();" /></b></font></td><td></td></tr></table>';

		$('#mt_submit_form').append(html_str3);

		var html_str4 = '<div id= "zoom" class="zoommenu"><font size="2">Zoom In/Zoom Out/Fit Image</font> \
        <button id="zoomin" class="labelBtnDraw" type="button" title="Zoom In" onclick="javascript:main_media.Zoom(1.15)" > \
        <img id="polygonModeImg" src="Icons/zoomin.png"  width="20" height="23" /> \
        </button> \
        <button id="zoomout" class="labelBtnDraw" type="button" title="Zoom Out" onclick="javascript:main_media.Zoom(1.0/1.15)" > \
        <img src="Icons/zoomout.png" width="20" height="23" /> \
        </button> ';
        html_str4 += ' <button id="fit" class="labelBtnDraw" type="button" title="Fit Image" onclick="javascript:main_media.Zoom(\'fitted\')" > \
        <img src="Icons/fitscreen.png"  width="20" height="23"  /> \
        </button> ';
    html_str4 += '</div>';
                
        //var html_str2 = '<font size="4"><b>Scroll up to see the entire image</b></font>&#160;&#160;&#160;<font size="3">Describe the painting</font><br /><textarea id="mt_comments_textbox" name="mt_comments_texbox" cols="94" nrows="3" />';
		$('#mt_submit_form').append(html_str4);
/*
  $('#zoomin').attr("onclick","javascript:main_media.Zoom(1.15)");
  $('#zoomout').attr("onclick","javascript:main_media.Zoom(1.0/1.15)");
  $('#fit').attr("onclick","javascript:main_media.Zoom('fitted')");

  <div id="label_buttons_drawing">
      <div id ="generic_buttons" class="annotatemenu">
      <!-- ZOOM IN BUTTON -->
      <button id="zoomin" class="labelBtnDraw" type="button" title="Zoom In">
        <img src="Icons/zoomin.png" width="28" height="38" />
      </button>
      <!-- ZOOM OUT BUTTON -->
      <button id="zoomout" class="labelBtnDraw" type="button" title="Zoom Out">
        <img src="Icons/zoomout.png" width="28" height="38" />
      </button>
      <!-- FIT IMAGE BUTTON -->
      <button id="fit" class="labelBtnDraw" type="button" title="Fit Image">
        <img src="Icons/fitscreen.png" width="28" height="38" />
      </button>
      </div>
    </div>
    */
                if(global_count >= mt_N) document.getElementById('mt_submit').disabled=false;
            }
        }
        else {
            return this.SetURL(labelme_url);
        }
        
        return 1;
    };
    
    /** Gets mode */
    this.GetMode = function() {
        return this.mode;
    };
    
    /** Gets collection name */
    this.GetCollection = function () {
        return this.collection;
    };
    
    /** Gets directory name */
    this.GetDirName = function () {
        return this.dir_name;
    };
    
    /** Gets image name */
    this.GetImName = function () {
        return this.im_name;
    };
    
    /** Sets image name */
    this.SetImName = function (newImName){
        this.im_name = newImName;
    };
    
    /** Gets image path */
    this.GetImagePath = function () {
        if((this.mode=='i') || (this.mode=='c') || (this.mode=='f') || (this.mode=='im') || (this.mode=='mt')) return 'Images/' + this.dir_name + '/' + this.im_name;
    };
    
    /** Gets annotation path */
    this.GetAnnotationPath = function () {
        if((this.mode=='i') || (this.mode=='c') || (this.mode=='f') || (this.mode=='im') || (this.mode=='mt')) return 'Annotations/' + this.dir_name + '/' + this.im_name.substr(0,this.im_name.length-4) + '.xml';
    };
    
    /** Gets full image name */
    this.GetFullName = function () {
        if((this.mode=='i') || (this.mode=='c') || (this.mode=='f') || (this.mode=='im') || (this.mode=='mt')) return this.dir_name + '/' + this.im_name;
    };
    
    /** Gets template path */
    this.GetTemplatePath = function () {
        if(!this.dir_name) return 'annotationCache/XMLTemplates/labelme.xml';
        return 'annotationCache/XMLTemplates/' + this.dir_name + '.xml';
    };
    
    // *******************************************
    // Private methods:
    // *******************************************
    
    /** String is assumed to have field=value form.  Parses string to
    return the field. */
    this.GetURLField = function (str) {
        var idx = str.indexOf('=');
        return str.substring(0,idx);
    };
    
    /** String is assumed to have field=value form.  Parses string to
     return the value. */
    this.GetURLValue = function (str) {
        var idx = str.indexOf('=');
        return str.substring(idx+1,str.length);
    };
    
    /** Changes current URL to include collection, directory, and image
    name information.  Returns false. */
    this.SetURL = function (url) {
        this.FetchImage();

	// Get base LabelMe URL:
        var idx = url.indexOf('?');
        if(idx != -1) {
            url = url.substring(0,idx);
        }
        
        // Include username in URL:
        var extra_field = '';
        if(username != 'anonymous') extra_field = '&username=' + username;
        
        if(this.mode=='i') window.location = url + '?collection=' + this.collection + '&mode=' + this.mode + '&folder=' + this.dir_name + '&image=' + this.im_name + extra_field;
        else if(this.mode=='im') window.location = url + '?collection=' + this.collection + '&mode=' + this.mode + '&folder=' + this.dir_name + '&image=' + this.im_name + extra_field;
        else if(this.mode=='mt') window.location = url + '?collection=' + this.collection + '&mode=' + this.mode + '&folder=' + this.dir_name + '&image=' + this.im_name + extra_field;
        else if(this.mode=='c') window.location = url + '?mode=' + this.mode + '&username=' + username + '&collection=' + this.collection + '&folder=' + this.dir_name + '&image=' + this.im_name + extra_field;
        else if(this.mode=='f') window.location = url + '?mode=' + this.mode + '&folder=' + this.dir_name + '&image=' + this.im_name + extra_field;
        return false;
    };
    
    /** Fetch next image. */
    this.FetchImage = function () {
	console.log("FetchImage");
        var url = 'annotationTools/perl/fetch_image.cgi?mode=' + this.mode + '&username=' + username + '&collection=' + this.collection.toLowerCase() + '&folder=' + this.dir_name + '&image=' + this.im_name;
        var im_req;
        // branch for native XMLHttpRequest object
        if (window.XMLHttpRequest) {
            im_req = new XMLHttpRequest();
            im_req.open("GET", url, false);
            im_req.send('');
        }
        else if (window.ActiveXObject) {
            im_req = new ActiveXObject("Microsoft.XMLHTTP");
            if (im_req) {
                im_req.open("GET", url, false);
                im_req.send('');
            }
        }
        if(im_req.status==200) {
            this.dir_name = im_req.responseXML.getElementsByTagName("dir")[0].firstChild.nodeValue;
            this.im_name = im_req.responseXML.getElementsByTagName("file")[0].firstChild.nodeValue;
			imgName = this.im_name;
        }
        else {
            alert('Fatal: there are problems with fetch_image.cgi');
        }
    };
    this.FetchPrevImage = function () {
		if (this.mode == 'i'){
			return;
		}
        var url = 'annotationTools/perl/fetch_prev_image.cgi?mode=' + this.mode + '&username=' + username + '&collection=' + this.collection.toLowerCase() + '&folder=' + this.dir_name + '&image=' + this.im_name;
        var im_req;
        // branch for native XMLHttpRequest object
        if (window.XMLHttpRequest) {
            im_req = new XMLHttpRequest();
            im_req.open("GET", url, false);
            im_req.send('');
        }
        else if (window.ActiveXObject) {
            im_req = new ActiveXObject("Microsoft.XMLHTTP");
            if (im_req) {
                im_req.open("GET", url, false);
                im_req.send('');
            }
        }
        if(im_req.status==200) {
            this.dir_name = im_req.responseXML.getElementsByTagName("dir")[0].firstChild.nodeValue;
            this.im_name = im_req.responseXML.getElementsByTagName("file")[0].firstChild.nodeValue;
			imgName = this.im_name;
        }
        else {
            alert('Fatal: there are problems with fetch_prev_image.cgi');
        }
    };
    this.PreFetchImage = function () {
        var url = 'annotationTools/perl/fetch_image.cgi?mode=' + this.mode + '&username=' + username + '&collection=' + this.collection.toLowerCase() + '&folder=' + this.dir_name + '&image=' + this.im_name;
        var im_req;
        // branch for native XMLHttpRequest object
        if (window.XMLHttpRequest) {
            im_req = new XMLHttpRequest();
            im_req.open("GET", url, true);
        }
        else if (window.ActiveXObject) {
            im_req = new ActiveXObject("Microsoft.XMLHTTP");
            if (im_req) {
                im_req.open("GET", url, true);
            }
        }
	console.log('prefetching')
	im_req.onload = function(e){
		if(im_req.status==200) {
		    dir_name = im_req.responseXML.getElementsByTagName("dir")[0].firstChild.nodeValue;
		    im_name = im_req.responseXML.getElementsByTagName("file")[0].firstChild.nodeValue;
		    path =  'Images/' + dir_name + '/' + im_name;
		    var img1 = new Image()
		    img1.src = path;
		    img1.onload = function (){
			console.log('preloaded');
		    }
		}
		else {
		    alert('Fatal: there are problems with fetch_image.cgi');
		}
	}
	im_req.send('');
    };
}

function provide_code(){
    var number_objects = document.querySelector('#number_objects').value;
    alert('Thank you for completing the task. Please enter your survey code below to claim your reward.\nsurvey code: ZCgDVlkp'+String(number_objects));
}

function get_desc(workerId, im_name){

  var art_desc = document.getElementById("mt_comments_textbox").value;

  var new_desc = new Object();

  new_desc.img_name = im_name;
  new_desc.worker_id = workerId;
  new_desc.desc = art_desc;

  var json_desc = null;
  /*
  $.getJSON( "/LabelMeAnnotationTool/Annotations/art_description.json", function( data ) {

    data['description'].push(new_desc);
    json_desc = JSON.stringify(data);

  });
  */

    $.ajax({
    type: "POST",
    url: 'annotationTools/perl/write_desc.cgi',
    data: new_desc,
    contentType: "text/xml",
    dataType: "text",
    error: function(xhr,ajaxOptions,thrownError) {
      console.log(xhr.status);
      console.log(thrownError);
    }
    });



  //var fs = require("fs");
  //fs.writeFile("/LabelMeAnnotationTool/Annotations/art_description.json", json, 'utf8', callback);


/*
  $.ajax({
    url: 'http://ec2-18-217-59-91.us-east-2.compute.amazonaws.com//LabelMeAnnotationTool/Annotations/art_description.json',
    type: 'POST',
    dataType: 'json',//no need for setting this to JSON if you don't receive a json response.
    data: new_desc
    });



  var newData = JSON.stringify(data);
  $updatedData = $_POST['newData'];
    // please validate the data you are expecting for security
  file_put_contents('path/to/thefile.json', $updatedData);


  <?php
    $myFile = "/LabelMeAnnotationTool/Annotations/art_description.json";
    $fh = fopen($myFile, 'w') or die("can't open file");
    $stringData = json;
    fwrite($fh, $stringData);
    fclose($fh)
  ?>
  */
}
