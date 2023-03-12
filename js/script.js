var myModal = $("#nameedit");
var myInput2 = $("#nameedit #name-tag");
var myInput3 = $("#nameedit #plate-licence");

var myModalimg = $("#imgedit");
var myModalimg2 = $("#imgedit #name-tag");
var myModalimg3 = $("#imgedit #plate-licence2");

var mouseWheelGContent = document.querySelector('.g-content');
$(document).ready(function () {
    $(".g-content").css("display", "none");
    $('#imgurl-tag').on('input', function () {
        // do something

        document.getElementById("myImg").src = document.getElementById("imgurl-tag").value;
    });

    $("#name-tag").keypress(function (e) {
        if (($(this).val().length + 1) >= 5) {
            $(".invalid-feedback").text("คุณสามารถใช้ชื่อนี้ได้")
            $(".invalid-feedback").css("color", "#63C328")
        } else {
            $(".invalid-feedback").text("กรุณาตั้งชื่อรถให้มากกว่า 5 ตัวอักษร")
            $(".invalid-feedback").css("color", "#FF0018")
            $(".invalid-feedback").css("display", "block")
        }
    });

    $("#img-edit").on("click", function (e) {
        var txt = $("#imgurl-tag").val().toString()
        var plt = $("#plate-licence2").text().toString()
        document.getElementById("g-pic" + $("#img-edit").data("cid")).src = txt;
        $.post("https://2Dev-MiniGarage/imgurl", JSON.stringify({ plate: plt, name: txt }));
        myModalimg.modal("hide");
    });

    $("#g-edit").on("click", function (e) {
        var txt = $("#name-tag").val().toString()
        var plt = $("#plate-licence").text().toString()
        if (txt.length >= 5) {
            $("#car-" + $("#g-edit").data("cid")).text(txt);
            $.post("https://2Dev-MiniGarage/Rename", JSON.stringify({ plate: plt, name: txt }));
            myModal.modal("hide");
        } else {
            $(".invalid-feedback").css("display", "block")
        }
    });

    $(function () {
        let el = document.querySelector(".g-content");
        let x = 0, y = 0, top = 0, left = 0;

        let draggingFunction = (e) => {
            document.addEventListener('mouseup', () => {
                document.removeEventListener("mousemove", draggingFunction);
            });

            el.scrollLeft = left - e.pageX + x;
            el.scrollTop = top - e.pageY + y;
        };

        el.addEventListener('mousedown', (e) => {
            e.preventDefault();

            y = e.pageY;
            x = e.pageX;
            top = el.scrollTop;
            left = el.scrollLeft;

            document.addEventListener('mousemove', draggingFunction);
        });

        window.addEventListener("message", function (event) {
            var e = event.data;
            if (e.action === "open-garage") {
                OpenGarageUI(e.data, e.title, e.zone);
            } else if (e.action === "open-pound") {
                OpenPoundUI(e.data, e.title, e.zone);
            }
            document.onkeyup = function (data) {
                if (data.which == 27) {
                    $(".g-content").css("display", "none");
                    $(".box-container").css("display", "none");
                    $.post("https://2Dev-MiniGarage/Exit", JSON.stringify({}));
                    return;
                }
            };

            mouseWheelGContent.addEventListener('wheel', function (e) {
                const race = 15; // How many pixels to scroll
                if (e.deltaY > 0) // Scroll right
                    mouseWheelGContent.scrollLeft += race;
                else // Scroll left
                    mouseWheelGContent.scrollLeft -= race;
                e.preventDefault();
            });
        });
    });
});

var state = {
    txt: { true: "รถพร้อมใช้งาน", false: "รถไม่อยู่ในการาจ" },
    sec: { true: 1, false: 2 },
    dis: { true: "", false: "disabled" }
};

const EditImage = (index, plate, name) => {
    $('#img-edit').attr('data-plate', plate.toString());
    $('#img-edit').data('plate', plate.toString());
    $('#img-edit').attr('data-cid', index.toString());
    $('#img-edit').data('cid', index.toString());
    myModalimg3.text(plate);
    myModalimg2.val($('#' + plate).text());
    myModalimg.modal('show');
}
const EditName = (index, plate, name) => {
    $('#g-edit').attr('data-plate', plate.toString());
    $('#g-edit').data('plate', plate.toString());
    $('#g-edit').attr('data-cid', index.toString());
    $('#g-edit').data('cid', index.toString());
    myInput3.text(plate);
    myInput2.val($('#' + plate).text());
    myModal.modal('show');
}

const SpawnCar = (plate, type) => {
    $.post("https://2Dev-MiniGarage/SpawnCar", JSON.stringify({ plate: plate, type: type }), function (cb) {
        if (cb) {
            $(".g-content").css("display", "none");
            $(".box-container").css("display", "none");
        }
    }, "json");
}

const FixSpawnCar = (plate, type) => {
    $.post("https://2Dev-MiniGarage/FixSpawnCar", JSON.stringify({ plate: plate, type: type }), function (cb) {
        if (cb) {
            $(".g-content").css("display", "none");
            $(".box-container").css("display", "none");
        }
    }, "json");
}

const OpenGarageUI = (data, title, izone) => {
    $(".g-content").empty();
    $("#menu-title-custom").text(` GARAGE (${title})`);
    $.each(data, function (index, data) {
        const status = data.vstatus;
        const temp = data.namemodel

        if (izone.VehicleType == data.vtype) {
            $('.g-content').append(`
      <div class="g-list gradient-border">
        <div class="g-item" data-gid="` + data.vplate + `" data-plate="` + data.vplate + `">
        <div class="title-car align-self-center">
                <p id="g-title" onclick="EditName('${index}','${data.vplate}','${data.vname}')"><span class="thisname" id="car-` + index + `">` + data.vname + `</span> <i class="fa-solid fa-pen-to-square"></i></p> 
            <div class="figure"><img onclick="EditImage('${index}','${data.vplate}','${data.vname}')" id="g-pic` + index + `" class="figure-img img-fluid rounded" src=` + data.namemodel + ` alt="Image not found" onerror="this.src='img/default.png';"/></div>
                <div class="desc">
                    <p id="g-title-desc" class="g-desc">ข้อมูลรถ</p>
                    <p id="g-title-plate" class="g-plate">` + data.vplate + `</p>
                <p id="g-title-status" class="status-` + state["sec"][status] + `"><i class="fa-solid fa-circle"></i> ` + state["txt"][status] + `</p>
            </div>
        </div>

        <div class="row row-cols-2 status-content">
            <div class="col">
            <div class="row row-cols-2 g-status">
                <div class="col icon">
                    <img width="35px" src="https://media.discordapp.net/attachments/1030094411150930060/1030111384719069204/jerrycan.png"/> 
                </div>
                <div class="col align-self-center pro">
                    <div class="progress">
                        <div class="progress-bar bg-fuel" role="progressbar" style="width: ` + data.vfuel + `%" aria-valuenow="` + data.vfuel + `" aria-valuemin="0" aria-valuemax="100">` + data.vfuel + `%</div>
                    </div>
                </div>
            </div>
            </div>
            <div class="col">
                <div><a onclick="SpawnCar('${data.vplate}','Garage')" aria-disabled="${status}" class="btn btn-car1 ${state["dis"][status]} btn-sm" id="pickcar">เบิกรถ</a></div>
            </div>
        </div>

        <div class="row row-cols-2 status-content">
            <div class="col">
            <div class="row row-cols-2 g-status">
                <div class="col icon">
                    <img width="35px" src="https://media.discordapp.net/attachments/1030094411150930060/1030111385050431538/car-engine.png"/>
                </div>
                <div class="col align-self-center pro">
                    <div class="progress">
                        <div class="progress-bar bg-engine" role="progressbar" style="width: ` + data.vhealth + `%" aria-valuenow="` + data.vhealth + `" aria-valuemin="0" aria-valuemax="100">` + data.vhealth + `%</div>
                    </div>
                </div>
            </div>
        </div>
            <div class="col">
                <div><a onclick="FixSpawnCar('${data.vplate}','Garage')" aria-disabled="${status}" class="btn btn-car2 ${state["dis"][status]} btn-sm" id="pickfix">เบิกพร้อมซ่อม</a></div>
        </div>
        </div>  
      </div>`);
        }

    });
    $(".box-container").css("display", "flex");
    $(".g-content").css("display", "flex");
};

const OpenPoundUI = (data, title, izone) => {
    $(".g-content").empty();
    $("#menu-title-custom").text(` GARAGE (${title})`);
    $.each(data, function (index, data) {
        const status = data.vstatus;
        // if (izone.jobs == undefined){
        //     izone.jobs = " "
        // }
        // console.log("data ",data.vjob)
        // console.log("izone", izone.jobs)
        if (izone.VehicleType == data.vtype) {
            if (izone.jobs == undefined) {
                if (data.vpolice == 0) {
                    $('.g-content').append(`
                    <div class="g-list gradient-border">
                      <div class="g-item" data-gid="` + data.vplate + `" data-plate="` + data.vplate + `">
                      <div class="title-car align-self-center">
                              <p id="g-title"><span class="thisname" id="car-` + index + `">` + data.vname + `</p> 
                          <div class="figure"><img id="g-pic" class="figure-img img-fluid rounded" src="` + data.namemodel + `" alt="Image not found" onerror="this.src='img/default.png';"/></div>
                              <div class="desc">
                                  <p id="g-title-desc" class="g-desc">ข้อมูลรถ</p>
                                  <p id="g-title-plate" class="g-plate">` + data.vplate + `</p>
                              <p id="g-title-status" class="status-3"><i class="fa-solid fa-circle"></i> รอการเรียกรถคืน</p>
                          </div>
                      </div>
              
                      <div class="row row-cols-2 status-content">
                          <div class="col">
                          <div class="row row-cols-2 g-status">
                              <div class="col icon">
                                  <img width="35px" src="https://media.discordapp.net/attachments/1030094411150930060/1030111384719069204/jerrycan.png"/> 
                              </div>
                              <div class="col align-self-center pro">
                                  <div class="progress">
                                      <div class="progress-bar bg-fuel" role="progressbar" style="width: ` + data.vfuel + `%" aria-valuenow="` + data.vfuel + `" aria-valuemin="0" aria-valuemax="100">` + data.vfuel + `%</div>
                                  </div>
                              </div>
                          </div>
                          </div>
                          <div class="col">
                              <div><a onclick="SpawnCar('${data.vplate}','Pound')" aria-disabled="false" class="btn btn-car1 btn-sm" id="pickcar">เบิกรถ</a></div>
                          </div>
                      </div>
              
                      <div class="row row-cols-2 status-content">
                          <div class="col">
                          <div class="row row-cols-2 g-status">
                              <div class="col icon">
                                  <img width="35px" src="https://media.discordapp.net/attachments/1030094411150930060/1030111385050431538/car-engine.png"/>
                              </div>
                              <div class="col align-self-center pro">
                                  <div class="progress">
                                      <div class="progress-bar bg-engine" role="progressbar" style="width: ` + data.vhealth + `%" aria-valuenow="` + data.vhealth + `" aria-valuemin="0" aria-valuemax="100">` + data.vhealth + `%</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                          <div class="col">
                              <div><a onclick="FixSpawnCar('${data.vplate}','Pound')" aria-disabled="false" class="btn btn-car2 btn-sm" id="pickfix">เบิกพร้อมซ่อม</a></div>
                      </div>
                      </div>  
                    </div>`);

                } else if (data.vpolice == 1) {
                    $('.g-content').append(`
                    <div class="g-list gradient-border">
                      <div class="g-item" data-gid="` + data.vplate + `" data-plate="` + data.vplate + `">
                      <div class="title-car align-self-center">
                              <p id="g-title"><span class="thisname" id="car-` + index + `">` + data.vname + `</p> 
                          <div class="figure"><img id="g-pic" class="figure-img img-fluid rounded" src="` + data.namemodel + `" alt="Image not found" onerror="this.src='img/default.png';"/></div>
                              <div class="desc">
                                  <p id="g-title-desc" class="g-desc">ข้อมูลรถ</p>
                                  <p id="g-title-plate" class="g-plate">` + data.vplate + `</p>
                              <p id="g-title-status" class="status-3"><i class="fa-solid fa-circle"></i>รถโดนตํารวจยึด</p>
                          </div>
                      </div>
              
                      <div class="row row-cols-2 status-content">
                          <div class="col">
                          <div class="row row-cols-2 g-status">
                              <div class="col icon">
                                  <img width="35px" src="https://media.discordapp.net/attachments/1030094411150930060/1030111384719069204/jerrycan.png"/> 
                              </div>
                              <div class="col align-self-center pro">
                                  <div class="progress">
                                      <div class="progress-bar bg-fuel" role="progressbar" style="width: ` + data.vfuel + `%" aria-valuenow="` + data.vfuel + `" aria-valuemin="0" aria-valuemax="100">` + data.vfuel + `%</div>
                                  </div>
                              </div>
                          </div>
                          </div>
                          <div class="col">
                              <div><a aria-disabled="false" class="btn btn-car1 btn-sm" id="pickcar">ไม่สามารถเบิกได้</a></div>
                          </div>
                      </div>
              
                      <div class="row row-cols-2 status-content">
                          <div class="col">
                          <div class="row row-cols-2 g-status">
                              <div class="col icon">
                                  <img width="35px" src="https://media.discordapp.net/attachments/1030094411150930060/1030111385050431538/car-engine.png"/>
                              </div>
                              <div class="col align-self-center pro">
                                  <div class="progress">
                                      <div class="progress-bar bg-engine" role="progressbar" style="width: ` + data.vhealth + `%" aria-valuenow="` + data.vhealth + `" aria-valuemin="0" aria-valuemax="100">` + data.vhealth + `%</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                          <div class="col">
                              <div><a  aria-disabled="false" class="btn btn-car2 btn-sm" id="pickfix">ไม่สามารถเบิกได้</a></div>
                      </div>
                      </div>  
                    </div>`);
                }
            } else if (izone.jobs == data.vjob) {
                if (data.vpolice == 0) {
                    $('.g-content').append(`
                    <div class="g-list gradient-border">
                      <div class="g-item" data-gid="` + data.vplate + `" data-plate="` + data.vplate + `">
                      <div class="title-car align-self-center">
                              <p id="g-title"><span class="thisname" id="car-` + index + `">` + data.vname + `</p> 
                          <div class="figure"><img id="g-pic" class="figure-img img-fluid rounded" src="` + data.namemodel + `" alt="Image not found" onerror="this.src='img/default.png';"/></div>
                              <div class="desc">
                                  <p id="g-title-desc" class="g-desc">ข้อมูลรถ</p>
                                  <p id="g-title-plate" class="g-plate">` + data.vplate + `</p>
                              <p id="g-title-status" class="status-3"><i class="fa-solid fa-circle"></i> รอการเรียกรถคืน</p>
                          </div>
                      </div>
              
                      <div class="row row-cols-2 status-content">
                          <div class="col">
                          <div class="row row-cols-2 g-status">
                              <div class="col icon">
                                  <img width="35px" src="https://media.discordapp.net/attachments/1030094411150930060/1030111384719069204/jerrycan.png"/> 
                              </div>
                              <div class="col align-self-center pro">
                                  <div class="progress">
                                      <div class="progress-bar bg-fuel" role="progressbar" style="width: ` + data.vfuel + `%" aria-valuenow="` + data.vfuel + `" aria-valuemin="0" aria-valuemax="100">` + data.vfuel + `%</div>
                                  </div>
                              </div>
                          </div>
                          </div>
                          <div class="col">
                              <div><a onclick="SpawnCar('${data.vplate}','Pound')" aria-disabled="false" class="btn btn-car1 btn-sm" id="pickcar">เบิกรถ</a></div>
                          </div>
                      </div>
              
                      <div class="row row-cols-2 status-content">
                          <div class="col">
                          <div class="row row-cols-2 g-status">
                              <div class="col icon">
                                  <img width="35px" src="https://media.discordapp.net/attachments/1030094411150930060/1030111385050431538/car-engine.png"/>
                              </div>
                              <div class="col align-self-center pro">
                                  <div class="progress">
                                      <div class="progress-bar bg-engine" role="progressbar" style="width: ` + data.vhealth + `%" aria-valuenow="` + data.vhealth + `" aria-valuemin="0" aria-valuemax="100">` + data.vhealth + `%</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                          <div class="col">
                              <div><a onclick="FixSpawnCar('${data.vplate}','Pound')" aria-disabled="false" class="btn btn-car2 btn-sm" id="pickfix">เบิกพร้อมซ่อม</a></div>
                      </div>
                      </div>  
                    </div>`);

                } else if (data.vpolice == 1) {
                    $('.g-content').append(`
                    <div class="g-list gradient-border">
                      <div class="g-item" data-gid="` + data.vplate + `" data-plate="` + data.vplate + `">
                      <div class="title-car align-self-center">
                              <p id="g-title"><span class="thisname" id="car-` + index + `">` + data.vname + `</p> 
                          <div class="figure"><img id="g-pic" class="figure-img img-fluid rounded" src="` + data.namemodel + `" alt="Image not found" onerror="this.src='img/default.png';"/></div>
                              <div class="desc">
                                  <p id="g-title-desc" class="g-desc">ข้อมูลรถ</p>
                                  <p id="g-title-plate" class="g-plate">` + data.vplate + `</p>
                              <p id="g-title-status" class="status-3"><i class="fa-solid fa-circle"></i>รถโดนตํารวจยึด</p>
                          </div>
                      </div>
              
                      <div class="row row-cols-2 status-content">
                          <div class="col">
                          <div class="row row-cols-2 g-status">
                              <div class="col icon">
                                  <img width="35px" src="https://media.discordapp.net/attachments/1030094411150930060/1030111384719069204/jerrycan.png"/> 
                              </div>
                              <div class="col align-self-center pro">
                                  <div class="progress">
                                      <div class="progress-bar bg-fuel" role="progressbar" style="width: ` + data.vfuel + `%" aria-valuenow="` + data.vfuel + `" aria-valuemin="0" aria-valuemax="100">` + data.vfuel + `%</div>
                                  </div>
                              </div>
                          </div>
                          </div>
                          <div class="col">
                              <div><a aria-disabled="false" class="btn btn-car1 btn-sm" id="pickcar">ไม่สามารถเบิกได้</a></div>
                          </div>
                      </div>
              
                      <div class="row row-cols-2 status-content">
                          <div class="col">
                          <div class="row row-cols-2 g-status">
                              <div class="col icon">
                                  <img width="35px" src="https://media.discordapp.net/attachments/1030094411150930060/1030111385050431538/car-engine.png"/>
                              </div>
                              <div class="col align-self-center pro">
                                  <div class="progress">
                                      <div class="progress-bar bg-engine" role="progressbar" style="width: ` + data.vhealth + `%" aria-valuenow="` + data.vhealth + `" aria-valuemin="0" aria-valuemax="100">` + data.vhealth + `%</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                          <div class="col">
                              <div><a  aria-disabled="false" class="btn btn-car2 btn-sm" id="pickfix">ไม่สามารถเบิกได้</a></div>
                      </div>
                      </div>  
                    </div>`);
                }
            }





        }

    });
    $(".box-container").css("display", "flex");
    $(".g-content").css("display", "flex");
};