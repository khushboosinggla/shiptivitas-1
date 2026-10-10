import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.map(client => ({...client, status:'backlog'})),
        inProgress: [],
        complete: [],
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }
  componentDidMount() {
  this.dragula = Dragula([
    this.swimlanes.backlog.current,
    this.swimlanes.inProgress.current,
    this.swimlanes.complete.current
  ]);

  
this.dragula.on('drop', () => {
  const containers = {
    backlog: this.swimlanes.backlog.current,
    inProgress: this.swimlanes.inProgress.current,
    complete: this.swimlanes.complete.current,
  };

  // Keep a lookup of all existing clients.
  const allClients = [
    ...this.state.clients.backlog,
    ...this.state.clients.inProgress,
    ...this.state.clients.complete,
  ];

  const clientsById = {};
  allClients.forEach(client => {
    clientsById[client.id] = client;
  });

  // Read the order and destination of the dropped cards.
  const readLane = (container, status) =>
    Array.from(container.children)
      .map(card => {
        const client = clientsById[card.dataset.id];
        return client ? { ...client, status } : null;
      })
      .filter(Boolean);

  const nextClients = {
    backlog: readLane(containers.backlog, 'backlog'),
    inProgress: readLane(containers.inProgress, 'in-progress'),
    complete: readLane(containers.complete, 'complete'),
  };

  // Restore the DOM to React's previous order before
  // asking React to render the new state.
  const elementsById = {};

  Object.values(containers).forEach(container => {
    Array.from(container.children).forEach(card => {
      elementsById[card.dataset.id] = card;
    });
  });

  Object.keys(containers).forEach(lane => {
    this.state.clients[lane].forEach(client => {
      const card = elementsById[client.id];
      if (card) {
        containers[lane].appendChild(card);
      }
    });
  });

  // React can now safely render the new order and statuses.
  this.setState({ clients: nextClients });
});

}

componentWillUnmount() {
  if (this.dragula) {
    this.dragula.destroy();
  }
}
  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
