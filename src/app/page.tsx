"use client";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [toUpdateEmail, setToUpdateEmail] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function createData(
    id: number,
    username: string,
    email: string,
    password: string,
    created: string
  ) {
    return { id, username, email, password, created };
  }

  const searchByEmail = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (searchEmail === "" && users.length === 0) return fetchUsers();

    const res = await fetch(
      `http://127.0.0.1:3002/api/users?email=${searchEmail}&username=${searchEmail}`
    );
    const json = await res.json();

    const data = json.map((user: any) =>
      createData(
        user.id,
        user.username,
        user.email,
        user.password,
        user.created
      )
    );

    setUsers(data);
  };

  const fetchUsers = async () => {
    const res = await fetch("http://127.0.0.1:3002/api/users");
    const json = await res.json();

    const data = json.map((user: any) =>
      createData(
        user.id,
        user.username,
        user.email,
        user.password,
        user.created
      )
    );

    setUsers(data);
  };

  const closeModal = () => {
    setEmail("");
    setUsername("");
    setPassword("");

    setAddModal(false);
    setUpdateModal(false);
    setDeleteModal(false);
  };

  const deleteUser = async (deleteEmail: string) => {
    const res = await fetch(
      `http://127.0.0.1:3002/api/users/?email=${deleteEmail}`,
      {
        method: "DELETE",
      }
    );
    if (res.status === 200) {
      alert("Usuário deletado com sucesso!");
      fetchUsers();
      closeModal();
    } else {
      alert("Erro ao deletar usuário!");
    }
  };

  const triggerUpdateUser = async (updateEmail: string) => {
    setToUpdateEmail(updateEmail);
    setUpdateModal(true);
  };

  const updateUser = async () => {
    const payload = {} as any;

    if (email && email.trim() !== "") {
      payload.newEmail = email;
    }

    if (password && password.trim() !== "") {
      payload.newPassword = password;
    }

    if (username && username.trim() !== "") {
      payload.newUsername = username;
    }

    const res = await fetch(
      `http://127.0.0.1:3002/api/users/?email=${toUpdateEmail}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (res.status === 200) {
      alert("Usuário atualizado com sucesso!");
      fetchUsers();
      closeModal();
    } else {
      alert("Erro ao atualizar usuário!");
    }
  };

  const addUser = async () => {
    const payload = {
      username,
      email,
      password,
    };

    const res = await fetch("http://127.0.0.1:3002/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      alert("Usuário criado com sucesso!");
      fetchUsers();
      closeModal();
    } else {
      alert("Erro ao criar usuário!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {addModal && (
        <div className="modal-wrapper">
          <div className="modal">
            <h2>Criar usuário</h2>
            <form className="modal-form">
              <div className="input-block">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  className="input"
                  type="text"
                  placeholder="Marcelo 20 Centavos"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-block">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="marceloyuri@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-block">
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="button" onClick={() => addUser()}>
                Criar
              </button>
              <button
                className="button secondary"
                type="button"
                onClick={() => closeModal()}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
      {updateModal && (
        <div className="modal-wrapper">
          <div className="modal">
            <h2>Atualizar usuário</h2>
            <p>{toUpdateEmail}</p>
            <form className="modal-form">
              <div className="input-block">
                <label htmlFor="username">Novo Username</label>
                <input
                  id="username"
                  className="input"
                  type="text"
                  placeholder="Novo username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label htmlFor="email">Novo Email</label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="Novo email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-block">
                <label htmlFor="password">Nova Senha</label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder="Nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="button" onClick={() => updateUser()}>
                Atualizar
              </button>
              <button
                className="button secondary"
                type="button"
                onClick={() => closeModal()}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
      <main>
        <div className="navbar">
          <div className="navbar-content">
            <h1>My Party Ingressos</h1>
            <div className="navbar-links">
              <button className="button" onClick={() => setAddModal(true)}>
                Adicionar usuário
              </button>
              <button className="button" onClick={() => fetchUsers()}>
                Atualizar
              </button>
            </div>
          </div>
        </div>
        <section className="usuarios-wrapper">
          <h2>Usuários</h2>
          <form className="search-bar">
            <input
              type="text"
              className="input"
              placeholder="Pesquisar por email ou username"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <button className="button" onClick={(e: any) => searchByEmail(e)}>
              Pesquisar
            </button>
          </form>
          <div className="table-wrapper">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="Usuarios">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Password</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((row: any) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.password}</TableCell>
                      <TableCell>{row.created}</TableCell>
                      <TableCell>
                        <div className="table-buttons">
                          <button
                            className="button"
                            onClick={() => triggerUpdateUser(row.email)}
                          >
                            Editar
                          </button>
                          <button
                            className="button secondary"
                            onClick={() => deleteUser(row.email)}
                          >
                            Deletar
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </section>
      </main>
    </>
  );
}
