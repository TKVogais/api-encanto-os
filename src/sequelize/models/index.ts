import { Permissao } from "./permissoes.model";
import { Role } from "./regras";
import Usuario from "./usuarios.model";

// Usuário ↔ Role
Usuario.belongsToMany(Role, { through: 'usuario_roles', foreignKey: 'idusuario', otherKey: 'idrole' });
Role.belongsToMany(Usuario, { through: 'usuario_roles', foreignKey: 'idrole', otherKey: 'idusuario' });

// Role ↔ Permission
Role.belongsToMany(Permissao, { through: 'role_permissions', foreignKey: 'idrole', otherKey: 'idpermission' });
Permissao.belongsToMany(Role, { through: 'role_permissions', foreignKey: 'idpermission', otherKey: 'idrole' });

// (Opcional) Usuário ↔ Permission
Usuario.belongsToMany(Permissao, { through: 'usuario_permissions', foreignKey: 'idusuario', otherKey: 'idpermission' });
Permissao.belongsToMany(Usuario, { through: 'usuario_permissions', foreignKey: 'idpermission', otherKey: 'idusuario' });

;
