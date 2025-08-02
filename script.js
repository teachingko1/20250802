// 격언 데이터
const quotes = [
    { text: "시간은 가장 귀중한 자본이다.", author: "테오프라스토스" },
    { text: "시간을 관리하는 것은 삶을 관리하는 것이다.", author: "앨런 레이킨" },
    { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤자민 프랭클린" },
    { text: "시간은 우리가 가진 가장 귀중한 자원이다.", author: "테오프라스토스" },
    { text: "계획이 없는 목표는 단지 소망일 뿐이다.", author: "앙투안 드 생텍쥐페리" },
    { text: "작은 진전이라도 매일 이루어내라.", author: "로버트 콜리어" },
    { text: "시간을 낭비하는 것은 삶을 낭비하는 것이다.", author: "벤자민 프랭클린" },
    { text: "성공의 비밀은 준비하는 것이다.", author: "알렉산더 그레이엄 벨" },
    { text: "오늘의 투자는 내일의 성공이다.", author: "로버트 키요사키" },
    { text: "시간을 아끼는 것은 돈을 버는 것과 같다.", author: "벤자민 프랭클린" },
    { text: "계획을 세우는 데 시간을 투자하라.", author: "스티븐 코비" },
    { text: "시간은 모든 것을 치유한다.", author: "소포클레스" },
    { text: "오늘 할 수 있는 일을 내일로 미루지 마라.", author: "벤자민 프랭클린" },
    { text: "시간을 지배하는 자가 인생을 지배한다.", author: "앨런 레이킨" },
    { text: "성공은 준비와 기회가 만날 때 온다.", author: "보비 언서" }
];

// Todo 앱 클래스
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDate();
        this.updateQuote();
        this.renderTodos();
        this.updateStats();
        this.showEmptyState();
        this.updateCharCount();
    }

    setupEventListeners() {
        // 할일 추가
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');

        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // 문자 수 카운트
        todoInput.addEventListener('input', () => this.updateCharCount());

        // 필터 버튼
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.closest('.filter-btn').dataset.filter);
            });
        });

        // 액션 버튼
        document.getElementById('clearCompleted').addEventListener('click', () => {
            this.showClearCompletedConfirm();
        });

        document.getElementById('clearAll').addEventListener('click', () => {
            this.showClearAllConfirm();
        });
    }

    updateDate() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
        };
        const dateString = now.toLocaleDateString('ko-KR', options);
        document.getElementById('currentDate').textContent = dateString;
    }

    updateQuote() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const quoteIndex = dayOfYear % quotes.length;
        const quote = quotes[quoteIndex];
        
        document.getElementById('quoteText').textContent = quote.text;
        document.getElementById('quoteAuthor').textContent = `- ${quote.author}`;
    }

    updateCharCount() {
        const input = document.getElementById('todoInput');
        const charCount = document.getElementById('charCount');
        const count = input.value.length;
        charCount.textContent = `${count}/100`;
        
        if (count > 80) {
            charCount.className = 'text-red-500 text-sm';
        } else if (count > 60) {
            charCount.className = 'text-yellow-500 text-sm';
        } else {
            charCount.className = 'text-gray-400 text-sm';
        }
    }

    async addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            await Swal.fire({
                icon: 'warning',
                title: '입력 오류',
                text: '할일을 입력해주세요!',
                confirmButtonColor: '#6366f1',
                confirmButtonText: '확인'
            });
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showEmptyState();

        input.value = '';
        input.focus();
        this.updateCharCount();

        await Swal.fire({
            icon: 'success',
            title: '성공!',
            text: '할일이 추가되었습니다!',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
        }
    }

    async editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const { value: newText } = await Swal.fire({
            title: '할일 수정',
            input: 'text',
            inputValue: todo.text,
            inputPlaceholder: '할일을 입력하세요...',
            showCancelButton: true,
            confirmButtonText: '수정',
            cancelButtonText: '취소',
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#6b7280',
            inputValidator: (value) => {
                if (!value || value.trim() === '') {
                    return '할일을 입력해주세요!';
                }
            }
        });

        if (newText && newText.trim() !== '') {
            todo.text = newText.trim();
            this.saveTodos();
            this.renderTodos();
            
            await Swal.fire({
                icon: 'success',
                title: '수정 완료!',
                text: '할일이 수정되었습니다!',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }
    }

    async deleteTodo(id) {
        const result = await Swal.fire({
            title: '할일 삭제',
            text: '이 할일을 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280'
        });

        if (result.isConfirmed) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.showEmptyState();
            
            await Swal.fire({
                icon: 'success',
                title: '삭제 완료!',
                text: '할일이 삭제되었습니다!',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // 필터 버튼 활성화 상태 업데이트
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-indigo-600', 'text-white');
            btn.classList.add('bg-indigo-100', 'text-indigo-700');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        activeBtn.classList.remove('bg-indigo-100', 'text-indigo-700');
        activeBtn.classList.add('active', 'bg-indigo-600', 'text-white');

        this.renderTodos();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            default:
                return this.todos;
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        todoList.innerHTML = '';

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `bg-white rounded-2xl p-6 shadow-lg border-l-4 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                todo.completed 
                    ? 'border-green-500 opacity-75' 
                    : 'border-indigo-500'
            }`;
            
            li.innerHTML = `
                <div class="flex items-center gap-4">
                    <input type="checkbox" class="w-6 h-6 text-indigo-600 rounded-lg focus:ring-indigo-500 focus:ring-2 cursor-pointer" ${todo.completed ? 'checked' : ''}>
                    <span class="flex-1 text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}">${this.escapeHtml(todo.text)}</span>
                    <div class="flex gap-2">
                        <button class="edit-btn bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-3 rounded-xl transition-colors duration-200" title="수정">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn bg-red-100 hover:bg-red-200 text-red-700 p-3 rounded-xl transition-colors duration-200" title="삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            // 이벤트 리스너 추가
            const checkbox = li.querySelector('input[type="checkbox"]');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            editBtn.addEventListener('click', () => this.editTodo(todo.id));
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            todoList.appendChild(li);
        });
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('pendingCount').textContent = pending;
    }

    showEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            emptyState.classList.remove('hidden');
            todoList.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            todoList.classList.remove('hidden');
        }
    }

    async showClearCompletedConfirm() {
        const completedCount = this.todos.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            await Swal.fire({
                icon: 'info',
                title: '알림',
                text: '완료된 할일이 없습니다.',
                confirmButtonColor: '#6366f1'
            });
            return;
        }

        const result = await Swal.fire({
            title: '완료된 항목 삭제',
            text: `완료된 ${completedCount}개의 할일을 삭제하시겠습니까?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280'
        });

        if (result.isConfirmed) {
            this.clearCompleted();
        }
    }

    async showClearAllConfirm() {
        if (this.todos.length === 0) {
            await Swal.fire({
                icon: 'info',
                title: '알림',
                text: '삭제할 할일이 없습니다.',
                confirmButtonColor: '#6366f1'
            });
            return;
        }

        const result = await Swal.fire({
            title: '전체 삭제',
            text: '모든 할일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            dangerMode: true
        });

        if (result.isConfirmed) {
            this.clearAll();
        }
    }

    async clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showEmptyState();
        
        await Swal.fire({
            icon: 'success',
            title: '삭제 완료!',
            text: '완료된 항목들이 삭제되었습니다!',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }

    async clearAll() {
        this.todos = [];
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.showEmptyState();
        
        await Swal.fire({
            icon: 'success',
            title: '삭제 완료!',
            text: '모든 할일이 삭제되었습니다!',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
