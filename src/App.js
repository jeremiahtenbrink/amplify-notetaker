import React, { Component }       from "react";
import { API, graphqlOperation }  from "aws-amplify";
import { withAuthenticator }      from "aws-amplify-react";
import { createNote, deleteNote } from "./graphql/mutations";
import { listNotes }              from "./graphql/queries";

class App extends Component {
    
    state = {
        notes: [],
        note:  ""
    };
    
    
    
    render() {
        const { notes, note } = this.state;
        return (
            <div className={ "flex flex-column items-center justify-center" +
            " pa3 bg-washed-red" }>
                <h1 className="code f2-l">Amplify Notetaker</h1>
                <form className="mb3" onSubmit={ this.handleAddNote }>
                    <input type={ "text" }
                           className={ "pa2 f4" }
                           placeholder={ "Write your note" }
                           onChange={ this.onChangeNote }
                           value={ note }
                    />
                    <button className={ "pa2 f4" } type={ "submit" }>Add Note
                    </button>
                </form>
                
                {/* notes list */ }
                <div>
                    { notes.map( item => (
                            <div
                                key={ item.id }
                                className={ "flex items-center" }
                            >
                                <li
                                    className={ "list pa1 f3" }
                                >
                                    { item.note }
                                </li>
                                <button
                                    className={ "bg-transparent bn f4" }
                                    onClick={ () => this.handleDeleteNote(
                                        item.id ) }
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                        )
                    ) }
                </div>
            </div>
        );
    }
    
    componentDidMount() {
        
        API.graphql( graphqlOperation( listNotes ) ).then( res => {
            this.setState( { notes: res.data.listNotes.items } );
        } ).catch( err => console.log( err ) );
        
    }
    
    onChangeNote = e => this.setState( { note: e.target.value } );
    
    handleAddNote = async e => {
        e.preventDefault();
        const { note, notes } = this.state;
        
        const input = {
            note
        };
        const result = await API.graphql(
            graphqlOperation( createNote, { input } ) );
        
        const newNote = result.data.createNote;
        const updatedNotes = [ newNote, ...notes ];
        this.setState( { notes: updatedNotes, note: "" } );
    };
    
    handleDeleteNote = noteId => {
        const input = { id: noteId };
        API.graphql( graphqlOperation( deleteNote, { input } ) ).then( res => {
            const deltedNoteId = res.data.deleteNote.id;
            
            const updatedNotes = this.state.notes.filter(
                note => note.id !== deltedNoteId );
            this.setState( { notes: updatedNotes } );
            
        } ).catch( err => console.log( err ) );
    };
}

export default withAuthenticator( App, { includeGreetings: true } );
