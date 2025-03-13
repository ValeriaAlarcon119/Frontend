import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidatos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent implements OnInit {
  candidatos: any[] = [];
  isFormVisible = false;
  isEditMode = false;
  selectedCandidato: any = {};
  formSubmitted: boolean = false;
  errorMessages: any = {};

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCandidatos();
  }

  loadCandidatos() {
    this.http.get('http://localhost:8000/api/candidatos')
      .subscribe((data: any) => {
        this.candidatos = data;
      });
  }

  openCreateForm() {
    this.isEditMode = false;
    this.selectedCandidato = { nombre: '', apellido: '', documento_identidad: '', correo: '', telefono: '' };
    this.errorMessages = {};
    this.showModal();
  }

  openEditForm(candidato: any) {
    this.isEditMode = true;
    this.selectedCandidato = { ...candidato };
    this.errorMessages = {};
    this.showModal();
  }

  closeForm() {
    this.isFormVisible = false;
    this.selectedCandidato = {};
    this.hideModal();
  }

  showModal() {
    const modalElement = document.getElementById('candidatoModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  hideModal() {
    const modalElement = document.getElementById('candidatoModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  createCandidato() {
    this.formSubmitted = true;
    this.errorMessages = {};

    if (!this.selectedCandidato.nombre) {
      this.errorMessages.nombre = 'Este campo es requerido.';
    }
    if (!this.selectedCandidato.apellido) {
      this.errorMessages.apellido = 'Este campo es requerido.';
    }
    if (!this.selectedCandidato.documento_identidad || isNaN(this.selectedCandidato.documento_identidad)) {
      this.errorMessages.documento_identidad = 'No se admiten letras en la cédula.';
    }
    if (!this.selectedCandidato.correo || !this.isValidEmail(this.selectedCandidato.correo)) {
      this.errorMessages.correo = 'Formato de correo inválido.';
    }
    if (!this.selectedCandidato.telefono) {
      this.errorMessages.telefono = 'Este campo es requerido.';
    } else if (isNaN(this.selectedCandidato.telefono)) {
      this.errorMessages.telefono = 'El teléfono solo puede contener números.';
    }

    if (Object.keys(this.errorMessages).length > 0) {
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.selectedCandidato.documento_identidad = Number(this.selectedCandidato.documento_identidad);
    console.log("Datos enviados:", this.selectedCandidato);
    this.http.post('http://localhost:8000/api/candidatos', this.selectedCandidato, { headers })
      .subscribe({
        next: (response) => {
          console.log('Candidato creado con éxito', response);
          this.loadCandidatos();
          this.closeForm();
        },
        error: (error) => {
          if (error.status === 422) {
            const errorResponse = error.error.errors;
            if (errorResponse.documento_identidad) {
              this.errorMessages.documento_identidad = 'Ya existe un registro con esta cédula.';
            }
            if (errorResponse.correo) {
              this.errorMessages.correo = 'Ya existe un registro con este correo.';
            }
          } else {
            console.error('Error al crear candidato', error);
          }
        }
      });
  }

  saveEdit() {
    this.http.put(`http://localhost:8000/api/candidatos/${this.selectedCandidato.id}`, this.selectedCandidato)
      .subscribe({
        next: (response) => {
          console.log('Candidato actualizado con éxito', response);
          this.loadCandidatos();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al actualizar candidato', error);
        }
      });
  }

  deleteCandidato(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este candidato?')) {
      this.http.delete(`http://localhost:8000/api/candidatos/${id}`).subscribe({
        next: () => {
          this.loadCandidatos();
        },
        error: (error) => {
          console.error('Error al eliminar candidato', error);
          alert(error.error.message);
        }
      });
    }
  }

  viewDetails(candidato: any): void {
    this.selectedCandidato = { ...candidato };
    this.showDetailsModal();
  }

  showDetailsModal(): void {
    const modalElement = document.getElementById('candidatoDetailsModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  closeDetailsModal(): void {
    const modalElement = document.getElementById('candidatoDetailsModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
