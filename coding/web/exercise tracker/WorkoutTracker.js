const LOCAL_STORAGE_KEY = "workout-tracker-entries";

export default class WorkoutTracker {
  constructor(root) {
    // console.log("---> WorkoutTracker()", root);
    this.root = root;
    this.root.insertAdjacentHTML("afterbegin", WorkoutTracker.html());

    this.loadEntries();
    this.updateView();

    this.root.querySelector(".tracker__add").addEventListener("click", _ => {
      // console.log("---> 'Add Entry' clicked...");
      let d = new Date();
      let year = d.getFullYear().toString();
      let month = (d.getMonth() + 1).toString().padStart(2, '0');
      let day = d.getDay().toString().padStart(2, '0');
      this.addEntry({
        date: `${ year }-${ month }-${ day }`,
        duration: 30,
        workout: "walking"
      });
    });
  }

  static html() {
    return `
    <table class="tracker">
    <thead>
      <tr>
        <th>Date</th>
        <th>Workout</th>
        <th>Duration</th>
        <th>Remove Entry</th>
      </tr>
    </thead>
    <tbody class="tracker__entries">
    </tbody>
    <tbody>
      <tr class="tracker__row tracker__row--add">
        <td colspan="4">
          <span class="tracker__add">Add Entry &plus;</span>
        </td>
      </tr>
    </tbody>
  </table>
    `;
  }

  static row_html() {
    return `<tr class="tracker__row">
      <td>
        <input type="date" class="tracker__date" />
      </td>
      <td>
        <select class="tracker__workout">
          <option value="walking">Walking</option>
          <option value="running">Running</option>
          <option value="cycling">Cycling</option>
          <option value="swimming">Swimming</option>
          <option value="yoga">Yoga</option>
        </select>
      </td>
      <td>
        <input type="number" class="tracker__duration">
        <span class="tracker__text">minutes</span>
      </td>
      <td>
        <button type="button" class="tracker__button tracker__delete">&times;</button>
      </td>
    </tr>`;
  }

  loadEntries() {
    this.entries = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  }

  saveEntries() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.entries ? this.entries : []));
  }

  updateView() {
    // console.log("---> updateView()", this.entries);
    const tableBody = this.root.querySelector(".tracker__entries");

    const addRow = (data) => {
      // console.log("---> addRow()", data)
      let template = document.createElement('template');
      template.innerHTML = WorkoutTracker.row_html();

      let row = template.content.firstElementChild;
      row.querySelector(".tracker__date").value = data.date;
      row.querySelector(".tracker__workout").value = data.workout;
      row.querySelector(".tracker__duration").value = data.duration;

      row.querySelector(".tracker__date").addEventListener("change", ({ target }) => {
        data.date = target.value;
        this.saveEntries();
      });
      row.querySelector(".tracker__workout").addEventListener("change", ({ target }) => {
        data.workout = target.value;
        this.saveEntries();
      });
      row.querySelector(".tracker__duration").addEventListener("change", ({ target }) => {
        data.duration = target.value;
        this.saveEntries();
      });
       row.querySelector(".tracker__delete").addEventListener("click", _ => {
        this.deleteEntry(data);
      });

      // console.log(row);
      tableBody.appendChild(row);
    };


    tableBody.querySelectorAll(".tracker__row").forEach(row => {
      row.remove();
    });

    this.entries.forEach(entry => addRow(entry));
  }

  addEntry(data) {
    this.entries.push(data);
    this.saveEntries();
    this.updateView();
  }

  deleteEntry(dataToDelete) {
    console.log("---> deleteEntry()", dataToDelete, this.entries);
    this.entries = this.entries.filter(data => { return data !== dataToDelete; });
    this.saveEntries();
    this.updateView();
  }
}
