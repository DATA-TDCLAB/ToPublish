/// import * as Autodesk from "@types/forge-viewer";

const DATAGRID_CONFIG = {
    requiredProps: ['name', 'Volume', 'Level','Area','Length','Assembly Description','Assembly Code','Keynote'], // Which properties should be requested for each object
    columns: [ // Definition of individual grid columns (see http://tabulator.info for more details)
        { title: 'ID', field: 'dbid' },
        { title: 'Name', field: 'name', width: 150 },
        { title: 'Volume', field: 'volume' },
        { title: 'Level', field: 'level' },
        { title: 'Area', field: 'area' },
        { title: 'Lenght', field: 'lenght' },
        { title: 'Assembly Description', field: 'assemblyd' },
        { title: 'Assembly Code', field: 'assemblyc' },
        { title: 'Keynote', field: 'keynote' }
    ],
    groupBy: 'assemblyd', // Optional column to group by
    createRow: (dbid, name, props) => { // Function generating grid rows based on recieved object properties
        const volume = props.find(p => p.displayName === 'Volume')?.displayValue;
        const level = props.find(p => p.displayName === 'Level' && p.displayCategory === 'Constraints')?.displayValue;
        const area = props.find(p => p.displayName === 'Area')?.displayValue;
        const lenght = props.find(p => p.displayName === 'Length')?.displayValue;
        const assemblyd = props.find(p => p.displayName === 'Assembly Description')?.displayValue;
        const assemblyc = props.find(p => p.displayName === 'Assembly Code')?.displayValue;
        const keynote = props.find(p => p.displayName === 'Keynote')?.displayValue
        return { dbid, name, volume, level ,area,lenght,assemblyd,assemblyc,keynote};
    },
    onRowClick: (row, viewer) => {
        viewer.isolate([row.dbid]);
        viewer.fitToView([row.dbid]);
    }
};

export class DataGridPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        super(extension.viewer.container, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        //this.container.style.width = (options.width || 500) + 'px';
        this.container.style.height = (options.height || 400) + 'px';
        this.container.style.resize = 'none';
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.initializeMoveHandlers(this.title);
        this.container.appendChild(this.title);
        this.content = document.createElement('div');
        this.content.style.height = '350px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `<div class="datagrid-container" style="position: relative; height: 350px;"></div>`;
        this.container.appendChild(this.content);
        // See http://tabulator.info
        this.table = new Tabulator('.datagrid-container', {
            height: '50%',
            layout: 'fitColumns',
            columns: DATAGRID_CONFIG.columns,
            groupBy: DATAGRID_CONFIG.groupBy,
            rowClick: (e, row) => DATAGRID_CONFIG.onRowClick(row.getData(), this.extension.viewer)
            

        });

        const export_botton =document.getElementById('export');
        export_botton.addEventListener('click',()=>{
        this.table.download("csv", "data.csv");
})
    }

    update(model, dbids) {
        this.table.clearData();
        model.getBulkProperties(dbids, { propFilter: DATAGRID_CONFIG.requiredProps }, (results) => {
            this.table.replaceData(results.map((result) => DATAGRID_CONFIG.createRow(result.dbId, result.name, result.properties)));
        }, (err) => {
            console.error(err);
        });
    }
}
