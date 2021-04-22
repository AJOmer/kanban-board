import React, {useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {v4 as uuid} from 'uuid';

const itemsFromBackend = [
  {
    id: uuid(), content: 'Study Data Structures + Algorithms', time: '2 hours'
  },
  {
    id: uuid(), content: 'Prospect Jobs', time: '1 hour' 
  },
  {
    id: uuid(), content: 'Targeted Networking', time: '1 hour' 
  },
  {
    id: uuid(), content: 'Submitting Applications', time: '30-45 min' 
  },
  {
    id: uuid(), content: 'Code/Projects', time: '1 hour' 
  },
  {
    id: uuid(), content: 'Trivia FE questions', time: '1 hour' 
  },
]

const columnsFromBackend = 
  {
    [uuid()]: {
      name: 'Requested',
      items: itemsFromBackend
    },
    [uuid()]: {
      name: 'Todo',
      items: []
    },
    [uuid()]: {
      name: 'In Progress',
      items: []
    },
    [uuid()]: {
      name: 'Completed',
      items: []
    }
  };

const onDragEnd = (result, columns, setColumns) => {
  if(!result.destination) return;
  const { source, destination} = result;
  if(source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    })
  } else {
  const column = columns[source.droppableId];
  const copiedItems = [...column.items];
  const [removed] = copiedItems.splice(source.index, 1);
  copiedItems.splice(destination.index, 0, removed);
  setColumns({
    ...columns,
    [source.droppableId]: {
      ...column, 
      items: copiedItems
    }
  });
  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend)

  return (
    <div style={{display: 'flex', justifyContent: 'center', height: '100%'}}>
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([id, columns]) => {
          return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h2>{columns.name}</h2>
              <div style={{margin: '8px'}}>
                <Droppable key={id} droppableId={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                      {
                        ...provided.droppableProps
                      } ref={provided.innerRef}
                        style={{background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey', padding: 4, width: 250, minHeight: 500}}>
                          {columns.items.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{userSelect: 'none', padding: 16, margin: '0 0 8px 0', minHeight: '50px', backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86', color: 'white', ...provided.draggableProps.style}}>
                                    {item.content}
                                    <div style={{fontStyle: 'italic', fontSize: '15px', padding: '4px'}}>
                                      {item.time}
                                    </div>
                                  </div>
                                )
                              }}
                            </Draggable>
                          ) 
                          })}
                          {provided.placeholder}
                      </div>
                    )
                  }}
                </Droppable>
               </div> 
            </div>  
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
