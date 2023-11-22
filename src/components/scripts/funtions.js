document.getElementById("input").addEventListener("change", handleFile);
      let listaDeCadenas = [];
      let excel;
      let arrayExcel;

      function handleFile(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        let number = 0;

        reader.onload = function (e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetList = workbook.SheetNames;
          const sheetContent = workbook.Sheets;
          excel = workbook.Sheets;
          const sheetListContainer = document.getElementById("sheet-list");
          // console.log('sheetContent: ',sheetContent)
          arrayExcel = Object.keys(sheetContent).map(key => key);
          mostrarTabla(arrayExcel[0]);
          sheetListContainer.innerHTML = `<h3>Lista de hojas:</h3><ul class='list-group'>`;
          sheetList.forEach((sheetName) => {
            sheetListContainer.innerHTML += `<li class='list-group-item list-group-item-primary'>
        <a class='link-a' id='element-${number}' href='#' onclick='mostrarTabla(${JSON.stringify(
              sheetName
            )}, ${number})'> 
        ${sheetName}
        </a></li>`;
            number++;
          });

          sheetListContainer.innerHTML += "</ul>";
        };

        reader.readAsArrayBuffer(file);
      }

      function mostrarTabla(sheet, condition) {
          console.log("que trae", sheet);
          sheet = excel[sheet];
        if ($.fn.DataTable.isDataTable(".table")) {
          $(".table").DataTable().destroy();
        }
        const tableDataContainer = document.querySelector(".table-data");
        tableDataContainer.innerHTML = "";

        const range = XLSX.utils.decode_range(sheet["!ref"]);
        const table = document.createElement("table");
        table.classList.add("table", "table-bordered");
        table.className = "table table-striped table-hover";
        table.id = "id-scroll";
        const thead = document.createElement("thead");
        thead.className = "table-primary";
        const tbody = document.createElement("tbody");

        table.appendChild(thead);
        table.appendChild(tbody);

        // Agregar encabezados de columna
        const headerRow = document.createElement("tr");
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = { c: C, r: range.s.r };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          const cell = sheet[cellRef];
          const th = document.createElement("th");
          th.textContent = cell ? cell.v : "";
          headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);

        // Agregar filas y celdas de datos
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          const row = document.createElement("tr");
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { c: C, r: R };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            const cell = sheet[cellRef];
            const td = document.createElement("td");
            td.textContent = cell ? cell.v : "";
            row.appendChild(td);
          }
          tbody.appendChild(row);
        }

        tableDataContainer.appendChild(table);

        // Inicializar DataTable para la tabla recién creada
        $(table).DataTable();
      }