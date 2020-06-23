import React from "react";
import Axios from "axios";
import {Table, Modal,ModalBody,ModalHeader,Button} from "reactstrap"

const API_URL = `http://localhost:8080`;

class WeekendTask extends React.Component {
    state = {
      selectedFile: null,
      arrMovies:[],
      // HARUS SAMA DENGAN ISI DATABASE(ENTITY)
      formMovies:{
        moviesName:"",
        movieYear: 0,
        movieDesc:""
      },
      editMovies:{
        moviesName:"",
        movieYear: 0,
        movieDesc:"",
        id:""
      },
    };
  
    inputHandler = (e, field, form) => {
      let { value } = e.target;
      this.setState({
        [form]: {
          ...this.state[form],
          [field]: value,
        },
      });
    };
  
    editMoviesHandler = () => {
        let formData = new FormData();
        formData.append(
          "file",
          this.state.selectedFile,
          this.state.selectedFile.name
        );
        formData.append("moviesData", JSON.stringify(this.state.editMovies));
        Axios.put(`${API_URL}/edit/${this.state.editMovies.id}`, formData)
          .then((res) => {
            this.setState({ modalOpen: false });
            this.getMovieList();
          })
          .catch((err) => {
           
            console.log(err);
          });
      };

      editBtnHandler = (idx) => {
        this.setState({
          editMovies: {
            ...this.state.arrMovies[idx],
          },
          modalOpen: true,
        });
      };
      getMovieList = () => {
        Axios.get(`${API_URL}/movies`)
          .then((res) => {
            this.setState({ arrMovies: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
      };
      deleteHandler = (id) => {
        Axios.delete(`${API_URL}/delete/${id}`)
          .then((res) => {
            console.log(res);
            this.getMovieList();
          })
          .catch((err) => {
            console.log(err);
          });
      };
      toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
      };
      componentDidMount() {
        this.getMovieList();
      }
    fileChangeHandler = (e) => {
      this.setState({ selectedFile: e.target.files[0] });
    };
  
    fileUploadHandler = () => {
      let formData = new FormData();
  
      formData.append(
        "file",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
      formData.append("moviesData", JSON.stringify(this.state.formMovies))
  
      Axios.post(`${API_URL}/addMovie`, formData)
        .then((res) => {
          console.log(res.data);
          this.getMovieList()
        })
        .catch((err) => {
          console.log("ERROR");
          console.log(err);
        });
        // console.log(this.state.formMovies)
        // console.log(JSON.stringify(this.state.formMovies))
    };
  
     renderMoviesList = () => {
    return this.state.arrMovies.map((val, idx) => {
      const { id, moviesName, movieYear, moviePict, movieDesc } = val;
      return (
        <>
          <tr>
            <td> {idx + 1} </td>
            <td> {moviesName} </td>
            <td> {movieYear} </td>
            <td>
              <img
                style={{ objectFit: "contain", width: "60px" }}
                src={moviePict}
                alt=""
              />
            </td>
            <td> {movieDesc} </td>
            <td>
              <input
                type="button"
                value="Edit"
                onClick={() => this.editBtnHandler(idx)}
              />
              <input
                type="button"
                value="Delete"
                onClick={() => this.deleteHandler(id)}
              />
            </td>
          </tr>
        </>
      );
    });
  };
  
    render() {
      return (
        <div>
          <h1>MOVIES</h1>
          <h5>NAMA FILM</h5>
          <input type="text" onChange={(e) => this.inputHandler(e, "moviesName")} />
          <h5>TAHUN RILIS</h5>
          <input type="text" onChange={(e) => this.inputHandler(e, "movieYear")} />
          <h5>DESKRIPSI FILM</h5>
          <input type="text" onChange={(e) => this.inputHandler(e, "movieDesc")} />
          <br />
          <input type="file" onChange={this.fileChangeHandler} />  
          <br />
          <input type="button" value="ADD Movies" onClick={this.fileUploadHandler} />
          <br />
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama Film</th>
                <th>Tahun</th>
                <th>Poster Film</th>
                <th>Deskripsi</th>
                <th colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderMoviesList()}</tbody>
          </Table>
          <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Edit Film</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <input
                  type="text"
                  className="custom-text-input h-100 pl-3"
                  value={this.state.editMovies.moviesName}
                  placeholder="Nama Film"
                  onChange={(e) => this.inputHandler(e, "moviesName", "editMovies")}
                />
              </div>
              <div className="col-12 mt-3">
                <input
                  type="text"
                  className="custom-text-input h-100 pl-3"
                  value={this.state.editMovies.movieYear}
                  placeholder="Tahun"
                  onChange={(e) => this.inputHandler(e, "movieYear", "editMovies")}
                />
              </div>
              <div className="col-12 mt-3">
                <input
                  type="file"
                  className="custom-text-input h-100 pl-3"
                  placeholder="Poster Film"
                  onChange={this.fileChangeHandler}
                />
              </div>
              <div className="col-12 mt-3">
                <textarea
                  value={this.state.editMovies.movieDesc}
                  onChange={(e) =>
                    this.inputHandler(e, "movieDesc", "editMovies")
                  }
                  style={{ resize: "none" }}
                  placeholder="Description"
                  className="custom-text-input"
                ></textarea>
              </div>
              <div className="col-5 mt-5 offset-1">
                <Button
                  className="w-100"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                </Button>
              </div>
              <div className="col-5 mt-5">
                <Button
                  className="w-100"
                  onClick={this.editMoviesHandler}
                  type="contained"
                >
                  Save
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        </div>
      );
    }
  }
  
  export default WeekendTask;