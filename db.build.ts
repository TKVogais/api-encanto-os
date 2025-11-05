import { Pessoa } from './src/sequelize/models/pessoas.model.ts';
import { Usuario } from './src/sequelize/models/usuarios.model.ts';
import { Permissao } from './src/sequelize/models/permissoes.model.ts';
import { Banco } from './src/sequelize/models/bancos.model.ts';
import { InventarioCachosModel } from './src/sequelize/models/inventariocachos.ts';
import { Lotes } from './src/sequelize/models/lotes.model.ts';
import { Areas } from './src/sequelize/models/areas.model.ts';
import { Fitas } from "./src/sequelize/models/fitas.model.ts";
import { Colheitas } from "./src/sequelize/models/colheita.ts";
import { ResumoColheitaModel } from "./src/sequelize/models/resumocolheita.ts";
import { ResumoPrevisao } from "./src/sequelize/models/resumoprevisao.model.ts";
import { MediasAreas } from "./src/sequelize/models/mediaarea.model.ts";
import { AjustesFitas } from "./src/sequelize/models/ajustesfitas.ts";
import { CorteCoracoes } from "./src/sequelize/models/cortecoracao.model.ts";
import { PrevisaoColheitas } from "./src/sequelize/models/previsaocolheita.model.ts";
import { ParamsAnuais } from './src/sequelize/models/params.model.ts'
import sequelize from './src/sequelize/config/config.ts';
import UsuarioPermissao from './src/sequelize/models/permissoes.usuarios.model.ts';
const { hash } = require("./src/util/hash.js");

(async () => {
  try {

    console.log("🔄 Iniciando sincronização das tabelas...");
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco estabelecida.\n");

    // Sincroniza cada tabela individualmente
    await Pessoa.sync({ force: true });
    console.log("🧍 Tabela 'pessoas' sincronizada.");

    await Usuario.sync({ force: true });
    console.log("👤 Tabela 'usuarios' sincronizada.");

    await Permissao.sync({ force: true });
    console.log("🔐 Tabela 'permissoes' sincronizada.");

    await UsuarioPermissao.sync({ force: true });
    console.log("🔐 Tabela 'permissoes_usuarios' sincronizada.");

    await Banco.sync({ force: true });
    console.log("🏦 Tabela 'bancos' sincronizada.");

   

    await Lotes.sync({ force: true });
    console.log("📦 Tabela 'lotes' sincronizada.");

    await Areas.sync({ force: true });
    console.log("📐 Tabela 'areas' sincronizada.");

    await Fitas.sync({ force: true });
    console.log("🎀 Tabela 'fitas' sincronizada.");

    await Colheitas.sync({ force: true });
    console.log("🌾 Tabela 'colheitas' sincronizada.");

    await ResumoColheitaModel.sync({ force: true });
    console.log("📊 Tabela 'resumo_colheitas' sincronizada.");

    await ResumoPrevisao.sync({ force: true });
    console.log("📈 Tabela 'resumo_previsao' sincronizada.");

    await MediasAreas.sync({ force: true });
    console.log("📏 Tabela 'medias_areas' sincronizada.");

    await CorteCoracoes.sync({ force: true });
    console.log("❤️‍🔥 Tabela 'corte_coracoes' sincronizada.");


    await ParamsAnuais.sync({ force: true })
    await PrevisaoColheitas.sync({ force: true });
    console.log("🌱 Tabela 'previsao_colheitas' sincronizada.");

     await InventarioCachosModel.sync({ force: true })
    console.log("🏦 Tabela 'inventariocachos' sincronizada.");

    await AjustesFitas.sync({ force: true });
    console.log("🏦 Tabela 'ajustesfitas' sincronizada.");

    console.log("\n✅ Todas as tabelas foram sincronizadas.\n");

    // 👤 Pessoa base
    const pessoaAdmin = await Pessoa.create({
      name: "Gabriel",
      sobrenome: "Júnio",
      tipopessoa: "Física",
      cpfcnpj: "123.456.789-00",
      logradouro: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cep: "12345-678",
      cidade: "Belo Horizonte",
      estado: "MG",
      email: "gabriel@example.com",
      telefone: "(31) 98765-4321",
      urlimage: "https://example.com/avatar.png",
      datanasc: new Date("1995-05-20"),
      estadocivil: "Solteiro(a)"
    });

    // 🔑 Usuário admin
    const senhaHash = await hash('senha123');
    const usuarioAdmin = await Usuario.create({
      idpessoa: pessoaAdmin.idpessoa,
      usuario: 'admin',
      senha: senhaHash,
      tipousuario: 'Administrador',
      status: 'Ativo'
    });

    // 🧩 Permissões
    const permissoes = await Permissao.bulkCreate([
      { permissao: 'admin', descricao: 'Acesso total ao sistema' },
      { permissao: 'usuario', descricao: 'Acesso padrão ao sistema' },
      { permissao: 'visualizar_relatorios', descricao: 'Permite visualizar relatórios' },
      { permissao: 'editar_usuarios', descricao: 'Permite editar usuários' },
      { permissao: 'excluir_usuarios', descricao: 'Permite excluir usuários' },
      { permissao: 'gerenciar_permissoes', descricao: 'Permite gerenciar permissões' },
      { permissao: 'criar_projetos', descricao: 'Permite criar projetos' },
      { permissao: 'editar_projetos', descricao: 'Permite editar projetos' },
      { permissao: 'excluir_projetos', descricao: 'Permite excluir projetos' },
      { permissao: 'visualizar_financeiro', descricao: 'Permite visualizar dados financeiros' },
    ], { returning: true });

    // 🌾 Lotes
    const lotes = await Lotes.bulkCreate([
      { lote: 'Lote 13', descricao: 'Produção principal' },
      { lote: 'Lote 3', descricao: 'Área secundária' },
      { lote: 'Lote 12', descricao: 'Área auxiliar' },
      { lote: 'Lote 8', descricao: 'Reserva 1' },
      { lote: 'Lote 9', descricao: 'Reserva 2' },
    ], { returning: true });

    // 📋 Áreas
    const areas = await Areas.bulkCreate([
      { area: 'N1', idlote: lotes[0].idlote, hect: 4, hectplant: 3.8, plantas: 8000 },
      { area: 'N2', idlote: lotes[0].idlote, hect: 4, hectplant: 3.8, plantas: 8000 },
      { area: 'N3', idlote: lotes[0].idlote, hect: 3, hectplant: 2.8, plantas: 6000 },
      { area: 'N4', idlote: lotes[0].idlote, hect: 3, hectplant: 2.8, plantas: 6000 },
      { area: 'N5', idlote: lotes[0].idlote, hect: 3, hectplant: 2.8, plantas: 6000 },
      { area: 'N6', idlote: lotes[0].idlote, hect: 3, hectplant: 2.8, plantas: 6000 },
      { area: 'N7', idlote: lotes[0].idlote, hect: 3.3, hectplant: 3, plantas: 6600 },
      { area: 'N8', idlote: lotes[1].idlote,hect: 4, hectplant: 3.8, plantas: 8000 },
      { area: 'N9', idlote: lotes[1].idlote,hect: 4, hectplant: 3.8, plantas: 8000 },
      { area: 'N10', idlote: lotes[1].idlote, hect: 4, hectplant: 3.8, plantas: 8000 },
      { area: 'N11', idlote: lotes[1].idlote, hect: 4, hectplant: 3.8, plantas: 8000 },
      { area: 'N12', idlote: lotes[1].idlote,hect: 4, hectplant: 3.8, plantas: 8000 },
      { area: 'N13', idlote: lotes[1].idlote, hect: 4, hectplant: 3.8, plantas: 8000 },
      { area: 'N14', idlote: lotes[2].idlote, hect: 4, hectplant: 3.8, plantas: 8000 },
      { area: 'N15', idlote: lotes[2].idlote, hect: 4, hectplant: 3.8, plantas: 8000 },
    ], { returning: true });

    // 🎀 Fitas (com cores HEX aproximadas)
    const fitas = await Fitas.bulkCreate([
      { fita: 'Amarela', hex: '#FFFB06' },
      { fita: 'Verde', hex: '#169A25' },
      { fita: 'Azul', hex: '#12239E' },
      { fita: 'Vinho', hex: '#77193E' },
      { fita: 'Neon', hex: '#FF501A' },
      { fita: 'Roxo', hex: '#9B67B0' },
      { fita: 'Dourada', hex: '#DFA100' },
      { fita: 'Branca', hex: '#DBDBDB' },
      { fita: 'Verde Claro', hex: '#55FF85' },
      { fita: 'Azul Claro', hex: '#8DC6EE' },
      { fita: 'Rosa', hex: '#E75189' },
      { fita: 'Laranja', hex: '#FF8A00' },
      { fita: 'Marrom', hex: '#73361C' },
      { fita: 'Verde Cana', hex: '#00FF00' },
      { fita: 'Preta', hex: '#000000' },
      { fita: 'Sem Fita', hex: '#CCCCCC' },
    ], { returning: true });

    // 📊 Médias reais por área
    const mediasPorArea: Record<string, number> = {
      N1: 25,
      N2: 24,
      N3: 21,
      N4: 22,
      N5: 23,
      N6: 22,
      N7: 24,
      N8: 24,
      N9: 21,
      N10: 23,
      N11: 21,
      N12: 21,
      N13: 21,
      N14: 21,
      N15: 21,
    };

    // Gera os registros de média conforme o nome da área
    const medias = areas.map((a) => ({
      idarea: a.idarea,
      media: mediasPorArea[a.area] ?? 0, // fallback caso falte algum nome
      status: "Ativo",
    }));

    await MediasAreas.bulkCreate(medias);


    // 🖼️ Atualiza imagem da pessoa
    await sequelize.query(`
      UPDATE mediasareas 
      SET status = "S"
    `);

    await sequelize.query(`
      UPDATE pessoas 
      SET urlimage = "https://instagram.fthe13-1.fna.fbcdn.net/v/t51.2885-19/564043623_18313498483216206_2649632846223031726_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fthe13-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QEM0sbZV2CkwUS2id0NAlUTZ2RzyKgzE1xYstKSTdaYHeuJ8wXDtPhoAHzh56xAJfg&_nc_ohc=YpBhhFPdQ1EQ7kNvwEWtWaN&_nc_gid=QKIJULAPj4J-B6oyhWc4mA&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_Afha2QHCuWM7JPYYAzc-dbsILl89eKhr3eRJQZO__LGnCA&oe=6911205B&_nc_sid=7a9f4b"
      WHERE idpessoa = ${pessoaAdmin.idpessoa};
    `);

    await sequelize.query(`
      INSERT INTO paramsanuais (ano, meta, percenmeta, colhido, previsto, mediacacho, coracoescorte, cachoscolhidos) values 
      (2022, 729, 0,0,0,0,0,0),
      (2023, 1400, 0,0,0,0,0,0),
      (2024, 2130, 0,0,0,0,0,0),
      (2025, 2750, 0,0,0,0,0,0);
      `);

    // 🔒 Vincula usuário admin à permissão admin
    await sequelize.query(`
      INSERT INTO usuarios_permissoes (idpermissao, idusuario)
      VALUES (${permissoes[0].idpermissao}, ${usuarioAdmin.idusuario});
    `);


    console.log('🚀 Dados populados com sucesso!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro ao popular o banco:', error);
    process.exit(1);
  }
})();
