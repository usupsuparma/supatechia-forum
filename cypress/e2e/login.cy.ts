describe('Login flow', () => {
  /*
   * Skenario pengujian:
   * 1. Membuka halaman login saat pengguna belum memiliki token.
   * 2. Mengisi email dan password yang valid.
   * 3. Menekan tombol Sign In dan memastikan token disimpan.
   * 4. Mengarahkan pengguna ke dashboard setelah profil dan data forum berhasil dimuat.
   */
  it('allows an existing user to sign in and see the dashboard', () => {
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          token: 'token-123',
        },
      },
    }).as('login');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          user: {
            id: 'user-1',
            name: 'Supatechia Member',
            email: 'member@example.com',
            avatar: '',
          },
        },
      },
    }).as('profile');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          users: [
            {
              id: 'user-1',
              name: 'Supatechia Member',
              email: 'member@example.com',
              avatar: '',
            },
          ],
        },
      },
    }).as('users');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/threads', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          threads: [
            {
              id: 'thread-1',
              title: 'Diskusi React Testing',
              body: '<p>Membahas strategi pengujian aplikasi forum.</p>',
              category: 'testing',
              createdAt: '2026-07-01T09:00:00.000Z',
              ownerId: 'user-1',
              upVotesBy: ['user-1'],
              downVotesBy: [],
              totalComments: 2,
            },
          ],
        },
      },
    }).as('threads');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/leaderboards', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          leaderboards: [
            {
              user: {
                id: 'user-1',
                name: 'Supatechia Member',
                email: 'member@example.com',
                avatar: '',
              },
              score: 100,
            },
          ],
        },
      },
    }).as('leaderboards');

    cy.visit('/login');

    cy.contains('h2', 'Welcome Back').should('be.visible');
    cy.get('input[autocomplete="email"]').type('member@example.com');
    cy.get('input[autocomplete="current-password"]').type('secret123');
    cy.contains('button', 'Sign In').click();

    cy.wait('@login').its('request.body').should('deep.equal', {
      email: 'member@example.com',
      password: 'secret123',
    });
    cy.wait('@profile');
    cy.wait(['@users', '@threads', '@leaderboards']);

    cy.location('pathname').should('eq', '/');
    cy.window().then((window) => {
      expect(window.localStorage.getItem('accessToken')).to.equal('token-123');
    });
    cy.contains('h1', 'Global Discussions').should('be.visible');
    cy.contains('Diskusi React Testing').should('be.visible');
  });
});
