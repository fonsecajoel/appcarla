import { useStore } from '../store/useStore';

export default function Anamnese({ client }) {
  const { updateClient } = useStore();

  const handleChange = (field, value) => {
    if (field === 'name') {
      updateClient(client.id, 'name', value);
    } else {
      updateClient(client.id, 'anamnese', { [field]: value });
    }
  };

  const data = client.anamnese || {};

  const Input = ({ label, field, type = 'text' }) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        value={field === 'name' ? client.name : data[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    </div>
  );

  const CheckboxText = ({ label, fieldCheck, fieldText }) => (
    <div className="form-group" style={{ marginBottom: '1.5rem', background: 'var(--clr-sidebar)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
      <label className="checkbox-label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
        <input
          type="checkbox"
          checked={!!data[fieldCheck]}
          onChange={(e) => handleChange(fieldCheck, e.target.checked)}
        />
        {label}
      </label>
      {data[fieldCheck] && (
        <input
          type="text"
          placeholder="Qual/Quais/Observações?"
          value={data[fieldText] || ''}
          onChange={(e) => handleChange(fieldText, e.target.value)}
          style={{ marginTop: '0.5rem' }}
        />
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Ficha de Anamnese Corporal</h2>
      
      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Dados Pessoais</h3>
      <div className="grid grid-cols-3 mb-6">
        <Input label="Data" field="data_ficha" type="date" />
        <Input label="Nome" field="name" />
        <Input label="Idade" field="idade" type="number" />
        <div className="form-group">
          <label>Sexo</label>
          <select value={data.sexo || ''} onChange={(e) => handleChange('sexo', e.target.value)}>
            <option value="">Selecione...</option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        <Input label="Data de Nascimento" field="data_nasc" type="date" />
        <Input label="Profissão" field="profissao" />
        <Input label="Etnia" field="etnia" />
        <Input label="Estado Civil" field="estado_civil" />
        <Input label="E-mail" field="email" type="email" />
        <Input label="Indicação" field="indicacao" />
        <Input label="Motivo da Visita" field="motivo" />
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Endereço e Contato</h3>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Endereço" field="endereco" />
        <Input label="Bairro" field="bairro" />
        <Input label="Cidade" field="cidade" />
        <Input label="CEP" field="cep" />
        <Input label="Fone Residencial" field="fone_res" />
        <Input label="Fone Comercial/Celular" field="fone_com" />
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Em caso de emergência</h3>
      <div className="grid grid-cols-2 mb-6">
        <Input label="Nome Contato" field="emerg_nome" />
        <Input label="Telefone Contato" field="emerg_tel" />
        <Input label="Médico" field="medico" />
        <Input label="Telefone Médico" field="medico_tel" />
        <Input label="Convênio Médico" field="convenio" />
        <Input label="Carteirinha / Hospital" field="carteirinha" />
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Histórico Clínico e Hábitos</h3>
      <div className="grid grid-cols-2 mb-6">
        <CheckboxText label="Costuma permanecer muito tempo sentada?" fieldCheck="sentada" fieldText="sentada_obs" />
        <CheckboxText label="Antecedentes cirúrgicos?" fieldCheck="cirurgia" fieldText="cirurgia_quais" />
        <CheckboxText label="Tratamento estético anterior?" fieldCheck="estetico_ant" fieldText="estetico_qual" />
        <CheckboxText label="Antecedentes alérgicos?" fieldCheck="alergia" fieldText="alergia_quais" />
        <CheckboxText label="Funcionamento intestinal regular?" fieldCheck="intestino" fieldText="intestino_obs" />
        <CheckboxText label="Pratica atividade física?" fieldCheck="esporte" fieldText="esporte_quais" />
        <CheckboxText label="É fumante?" fieldCheck="fumante" fieldText="fumante_obs" />
        <CheckboxText label="Alimentação balanceada?" fieldCheck="alimentacao" fieldText="alimentacao_tipo" />
        <CheckboxText label="Ingere líquidos com frequência?" fieldCheck="liquido" fieldText="liquido_quanto" />
        <CheckboxText label="É gestante? / Tem filhos?" fieldCheck="gestante" fieldText="gestante_quantos" />
        <CheckboxText label="Problema ortopédico?" fieldCheck="ortopedico" fieldText="ortopedico_qual" />
        <CheckboxText label="Faz algum tratamento médico?" fieldCheck="tratamento" fieldText="tratamento_qual" />
        <CheckboxText label="Usa ou já usou ácidos na pele?" fieldCheck="acidos" fieldText="acidos_quais" />
        <CheckboxText label="Já fez algum tratamento ortomolecular?" fieldCheck="ortomolecular" fieldText="ortomolecular_qual" />
        <CheckboxText label="Cuidados Diários e produtos em uso?" fieldCheck="cuidados" fieldText="cuidados_quais" />
        <CheckboxText label="Portador de Marcapasso?" fieldCheck="marcapasso" fieldText="marcapasso_obs" />
        <CheckboxText label="Presença de metais?" fieldCheck="metais" fieldText="metais_local" />
        <CheckboxText label="Antecedentes oncológicos?" fieldCheck="oncologico" fieldText="oncologico_qual" />
        <CheckboxText label="Ciclo menstrual regular?" fieldCheck="menstrual" fieldText="menstrual_obs" />
        <CheckboxText label="Usa método anticoncepcional?" fieldCheck="anticoncepcional" fieldText="anticoncepcional_qual" />
        <CheckboxText label="Varizes?" fieldCheck="varizes" fieldText="varizes_grau" />
        <CheckboxText label="Lesões?" fieldCheck="lesoes" fieldText="lesoes_quais" />
        <CheckboxText label="Hipertensão?" fieldCheck="hipertensao" fieldText="hipertensao_obs" />
        <CheckboxText label="Epilepsia?" fieldCheck="epilepsia" fieldText="epilepsia_obs" />
        <CheckboxText label="Hipotensão?" fieldCheck="hipotensao" fieldText="hipotensao_obs" />
        <CheckboxText label="Diabetes?" fieldCheck="diabetes" fieldText="diabetes_obs" />
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-primary)' }}>
        <h4 style={{ marginBottom: '1rem' }}>Termo de Responsabilidade</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '1rem' }}>
          Declaro ter sido informada sobre todos os procedimentos, riscos e cuidados necessários para o tratamento estético, assumindo a responsabilidade pelas informações acima prestadas.
        </p>
        <label className="checkbox-label" style={{ fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={!!data.termo_aceito}
            onChange={(e) => handleChange('termo_aceito', e.target.checked)}
          />
          Li e aceito os termos e afirmo que as informações acima são verdadeiras.
        </label>
      </div>
    </div>
  );
}
